import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "../api/base44Client";
import type { LocalBackupPayload } from "../types/appTypes";

const DEVICE_ID_KEY = "living-word:cloud-device-id";

interface Base44User {
  id: string;
  email: string;
  full_name?: string | null;
}

interface PrivateVaultRecord {
  id: string;
  device_id: string;
  device_label: string;
  schema_version: number;
  client_updated_at: string;
  record_count: number;
  visibility: "private";
  payload: LocalBackupPayload;
}

interface CloudStudyVaultProps {
  buildSnapshot: () => LocalBackupPayload;
  onPreviewRestore: (payload: LocalBackupPayload, savedAt: string) => Promise<void>;
}

function getDeviceId() {
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const next = window.crypto?.randomUUID?.() ?? `browser-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, next);
    return next;
  } catch {
    return `browser-${Date.now()}`;
  }
}

function getDeviceLabel() {
  const userAgentData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const platform = userAgentData?.platform || navigator.platform || "Web browser";
  const browser = /Edg\//.test(navigator.userAgent)
    ? "Edge"
    : /Firefox\//.test(navigator.userAgent)
      ? "Firefox"
      : /Chrome\//.test(navigator.userAgent)
        ? "Chrome"
        : /Safari\//.test(navigator.userAgent)
          ? "Safari"
          : "Browser";
  return `${browser} on ${platform}`;
}

function snapshotRecordCount(payload: LocalBackupPayload) {
  return [
    payload.notes,
    payload.prayerEntries,
    payload.memoryItems,
    payload.studyEntries,
    payload.studyCaptures,
    payload.studyProjects,
    payload.highlights,
    payload.favorites,
    payload.completions,
    payload.sourceMappings,
  ].reduce((total, items) => total + (Array.isArray(items) ? items.length : 0), 0);
}

function friendlyDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
}

export default function CloudStudyVault({ buildSnapshot, onPreviewRestore }: CloudStudyVaultProps) {
  const [user, setUser] = useState<Base44User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [vaults, setVaults] = useState<PrivateVaultRecord[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register" | "verify">("login");
  const [otpCode, setOtpCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const deviceId = useMemo(getDeviceId, []);

  const loadVaults = useCallback(async () => {
    const records = await base44.entities.PrivateStudyVault.list("-client_updated_at", 20);
    setVaults(records as PrivateVaultRecord[]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void base44.auth.me()
      .then((currentUser) => {
        if (cancelled) return;
        setUser(currentUser as Base44User);
        return loadVaults();
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => { cancelled = true; };
  }, [loadVaults]);

  async function runAuth(action: () => Promise<unknown>) {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The account request could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  function login() {
    void runAuth(async () => {
      await base44.auth.loginViaEmailPassword(email.trim(), password);
      const currentUser = await base44.auth.me();
      setUser(currentUser as Base44User);
      setPassword("");
      setMessage("Signed in. Your private cloud vault is ready.");
      await loadVaults();
    });
  }

  function register() {
    void runAuth(async () => {
      if (password.length < 8) {
        setMessage("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      await base44.auth.register({ email: email.trim(), password });
      setPassword("");
      setConfirmPassword("");
      setAuthMode("verify");
      setMessage("Check your email for the verification code.");
    });
  }

  function verify() {
    void runAuth(async () => {
      const result = await base44.auth.verifyOtp({ email: email.trim(), otpCode: otpCode.trim() }) as { access_token?: string } | null;
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setOtpCode("");
      const currentUser = await base44.auth.me();
      setUser(currentUser as Base44User);
      await loadVaults();
      setMessage("Email verified. Your private cloud vault is ready.");
    });
  }

  function resendOtp() {
    void runAuth(async () => {
      await base44.auth.resendOtp(email.trim());
      setMessage("A new verification code has been sent to your email.");
    });
  }

  function saveSnapshot() {
    void runAuth(async () => {
      const payload = buildSnapshot();
      const savedAt = new Date().toISOString();
      const data = {
        device_id: deviceId,
        device_label: getDeviceLabel(),
        schema_version: payload.schemaVersion ?? 2,
        client_updated_at: savedAt,
        record_count: snapshotRecordCount(payload),
        visibility: "private" as const,
        payload,
      };
      const existing = vaults.find((vault) => vault.device_id === deviceId);
      if (existing) await base44.entities.PrivateStudyVault.update(existing.id, data);
      else await base44.entities.PrivateStudyVault.create(data);
      await loadVaults();
      setMessage("Private study snapshot saved. Nothing was shared.");
    });
  }

  function deleteSnapshot(vault: PrivateVaultRecord) {
    if (!window.confirm(`Delete the private snapshot from ${vault.device_label}? Your current on-device studies will not be removed.`)) return;
    void runAuth(async () => {
      await base44.entities.PrivateStudyVault.delete(vault.id);
      await loadVaults();
      setMessage("Cloud snapshot deleted. Local studies were left untouched.");
    });
  }

  if (!authChecked) {
    return <p className="muted">Checking your private account…</p>;
  }

  if (!user) {
    return (
      <div className="cloud-vault-auth">
        <div>
          <p className="eyebrow">Private online study</p>
          <h2>{authMode === "register" ? "Create your account" : authMode === "verify" ? "Verify your email" : "Save studies privately online"}</h2>
          <p className="muted">Reading and search do not require an account. Sign in only when you want private studies available in another browser.</p>
        </div>
        {authMode === "verify" ? (
          <label><span>Verification code</span><input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" /></label>
        ) : (
          <>
            <label><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
            <label><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={authMode === "register" ? "new-password" : "current-password"} /></label>
            {authMode === "register" && (
              <label><span>Confirm password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></label>
            )}
          </>
        )}
        <div className="profile-action-row cloud-vault-actions">
          {authMode === "verify" ? (
            <>
              <button type="button" disabled={busy || !otpCode.trim()} onClick={verify}>Verify email</button>
              <button type="button" disabled={busy} onClick={resendOtp}>Resend code</button>
            </>
          ) : (
            <button type="button" disabled={busy || !email.trim() || !password || (authMode === "register" && !confirmPassword)} onClick={authMode === "register" ? register : login}>
              {busy ? "Please wait…" : authMode === "register" ? "Create private account" : "Sign in"}
            </button>
          )}
          <button type="button" disabled={busy} onClick={() => {
            setAuthMode(authMode === "login" ? "register" : "login");
            setMessage("");
          }}>
            {authMode === "login" ? "Create an account" : "Back to sign in"}
          </button>
          <button type="button" disabled={busy} onClick={() => base44.auth.loginWithProvider("google", window.location.href)}>Continue with Google</button>
        </div>
        {message && <p className="cloud-vault-message" role="status">{message}</p>}
      </div>
    );
  }

  return (
    <div className="cloud-vault-account">
      <header>
        <div><p className="eyebrow">Private online study</p><h2>{user.full_name || user.email}</h2><p className="muted">Only this account can read, change, or delete these snapshots. Saving is manual while the feature is being tested.</p></div>
        <span className="cloud-vault-private-badge">Private by default</span>
      </header>
      <div className="profile-action-row cloud-vault-actions">
        <button type="button" disabled={busy} onClick={saveSnapshot}>{busy ? "Saving…" : "Save this device to cloud"}</button>
        <button type="button" disabled={busy} onClick={() => base44.auth.logout(window.location.href)}>Sign out</button>
      </div>
      {message && <p className="cloud-vault-message" role="status">{message}</p>}
      <div className="cloud-vault-list">
        {vaults.length ? vaults.map((vault) => (
          <article key={vault.id}>
            <div><strong>{vault.device_label}</strong><span>{friendlyDate(vault.client_updated_at)} · {vault.record_count.toLocaleString()} saved items</span></div>
            <div>
              <button type="button" disabled={busy} onClick={() => void onPreviewRestore(vault.payload, vault.client_updated_at)}>Review &amp; restore</button>
              <button type="button" disabled={busy} onClick={() => deleteSnapshot(vault)}>Delete</button>
            </div>
          </article>
        )) : <p className="muted">No cloud snapshot yet. Your current studies remain safely stored on this device.</p>}
      </div>
      <p className="cloud-vault-privacy-note">Private means other Living Word users cannot access these records. This first version is not end-to-end encrypted.</p>
    </div>
  );
}