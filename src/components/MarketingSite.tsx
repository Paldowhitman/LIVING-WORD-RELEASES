import { useEffect } from "react";
import readerStudyScreenshot from "../assets/marketing/living-word-reader-study.jpg";
import timelineScreenshot from "../assets/marketing/living-word-timeline.jpg";
import knowledgeGraphScreenshot from "../assets/marketing/living-word-knowledge-graph.jpg";
import sourceLibraryScreenshot from "../assets/marketing/living-word-source-library.jpg";

const WINDOWS_RELEASE_BASE_URL = "https://github.com/Paldowhitman/LIVING-WORD-RELEASES/releases/download/v0.1.14";
const ANDROID_RELEASE_BASE_URL = "https://github.com/Paldowhitman/LIVING-WORD-RELEASES/releases/download/v0.1.15";
const WINDOWS_DOWNLOAD_URL = (import.meta.env.VITE_WINDOWS_DOWNLOAD_URL as string | undefined)?.trim()
  || `${WINDOWS_RELEASE_BASE_URL}/Living-Word-0.1.14-Windows-x64-Setup.exe`;
const ANDROID_DOWNLOAD_URL = (import.meta.env.VITE_ANDROID_DOWNLOAD_URL as string | undefined)?.trim()
  || `${ANDROID_RELEASE_BASE_URL}/Living-Word-0.1.15-Android-arm64-Beta.apk`;

function DownloadAction({ href, children }: { href?: string; children: string }) {
  if (!href) {
    return <span className="marketing-button marketing-button-muted" aria-disabled="true">{children}</span>;
  }
  return <a className="marketing-button marketing-button-primary" href={href} download>{children}</a>;
}

export default function MarketingSite() {
  useEffect(() => {
    document.title = "Living Word | Offline-first Bible study";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = "Read Scripture, search an offline reference library, build studies, and explore biblical history with Living Word for desktop, Android, and the web.";
    }
  }, []);

  return (
    <div className="marketing-site">
      <header className="marketing-header">
        <a className="marketing-brand" href="#top" aria-label="Living Word home">
          <span>LW</span>
          <strong>Living Word<small>Bible study, without the noise</small></strong>
        </a>
        <nav aria-label="Website navigation">
          <a href="#why">Why Living Word</a>
          <a href="#tour">See the app</a>
          <a href="#features">Features</a>
          <a href="#download">Download</a>
          <a href="/beta">Beta testers</a>
          <a className="marketing-nav-app" href="/app">Open web app</a>
        </nav>
      </header>

      <main id="top">
        <section className="marketing-hero">
          <div className="marketing-hero-copy">
            <p className="marketing-kicker">Offline-first. Source-aware. Built around Scripture.</p>
            <h1>A focused study room for the Bible.</h1>
            <p className="marketing-lede">
              Read, search, compare, take notes, trace history, and build lasting studies without ads,
              distractions, or an always-on internet connection.
            </p>
            <div className="marketing-actions">
              <a className="marketing-button marketing-button-primary" href="/app">Study online</a>
              <a className="marketing-button marketing-button-secondary" href="#download">Download for offline use</a>
            </div>
            <div className="marketing-trust" aria-label="Product promises">
              <span>Works offline</span><span>Private by default</span><span>No advertising</span><span>Public-domain sources</span>
            </div>
          </div>

          <div className="marketing-product" aria-label="Living Word app preview">
            <div className="marketing-window-bar"><i /><i /><i /><span>Living Word</span></div>
            <div className="marketing-product-screen">
              <img src={readerStudyScreenshot} alt="Living Word open to John 1 with the reader and verse notes" />
              <div className="marketing-product-callout">
                <span>REAL APP VIEW</span>
                <strong>Read without losing your place.</strong>
              </div>
            </div>
            <div className="marketing-window-body">
              <aside><strong>LW</strong><span>Read</span><span>Study</span><span>Journal</span><span>Timeline</span></aside>
              <article>
                <p>1 JOHN 1</p>
                <h2>Walk in the light.</h2>
                <div className="marketing-verse"><b>1</b><span>That which was from the beginning, which we have heard, which we have seen with our eyes...</span></div>
                <div className="marketing-verse marketing-verse-active"><b>5</b><span>God is light, and in him is no darkness at all.</span></div>
                <div className="marketing-study-strip"><span>Passage</span><span>Words</span><span>Context</span><span>My study</span></div>
              </article>
              <section><p>PASSAGE GUIDE</p><strong>1 John 1:5</strong><small>Cross references</small><b>John 1:4–9</b><b>Psalm 27:1</b><small>Study note</small><em>Light describes God’s revealed holiness and truth.</em></section>
            </div>
          </div>
        </section>

        <section id="why" className="marketing-statement">
          <p>THE HEART OF LIVING WORD</p>
          <h2>Read first. Study deeply. Keep Scripture at the center.</h2>
          <span>Living Word brings serious tools close without letting the tools crowd out the text.</span>
        </section>

        <section id="tour" className="marketing-showcase">
          <header>
            <div>
              <p>SEE LIVING WORD AT WORK</p>
              <h2>One quiet workspace. Many ways into the text.</h2>
            </div>
            <span>Every image below is a real view from the current Living Word beta.</span>
          </header>

          <div className="marketing-showcase-grid">
            <figure className="marketing-showcase-card marketing-showcase-reader">
              <div className="marketing-screenshot-frame"><img src={readerStudyScreenshot} alt="John 1 in the Living Word reader beside local verse notes" loading="lazy" /></div>
              <figcaption><span>READ + STUDY</span><strong>Scripture stays central.</strong><p>Read a chapter, select a verse, trace its words, and keep notes beside the text.</p></figcaption>
            </figure>

            <figure className="marketing-showcase-card marketing-showcase-timeline">
              <div className="marketing-screenshot-frame"><img src={timelineScreenshot} alt="The Living Word interactive biblical and historical timeline" loading="lazy" /></div>
              <figcaption><span>EXPLORE HISTORY</span><strong>See the passage in time.</strong><p>Move through biblical eras, compare chronology systems, and search 9,690 source-linked timeline candidates.</p></figcaption>
            </figure>

            <figure className="marketing-showcase-card">
              <div className="marketing-screenshot-frame"><img src={knowledgeGraphScreenshot} alt="Living Word knowledge graph showing relationships around John 1 verse 1" loading="lazy" /></div>
              <figcaption><span>TRACE CONNECTIONS</span><strong>Follow relationships visually.</strong><p>Explore passages, themes, people, places, and source connections without leaving your study.</p></figcaption>
            </figure>

            <figure className="marketing-showcase-card">
              <div className="marketing-screenshot-frame"><img src={sourceLibraryScreenshot} alt="Living Word offline resource and expanded canon library" loading="lazy" /></div>
              <figcaption><span>OPEN THE LIBRARY</span><strong>Carry the sources with you.</strong><p>Browse Scripture, historical works, commentaries, dictionaries, audio, and the expanded book catalog.</p></figcaption>
            </figure>
          </div>
        </section>

        <section id="features" className="marketing-section">
          <header><p>ONE WORKSPACE</p><h2>Everything you need to follow a passage further.</h2></header>
          <div className="marketing-feature-grid">
            <article><span>01</span><h3>Clear Scripture reading</h3><p>Move through the Bible chapter by chapter and keep selected verses connected to every study tool.</p></article>
            <article><span>02</span><h3>Powerful offline search</h3><p>Find references, remembered phrases, people, places, dictionary entries, and local source material.</p></article>
            <article><span>03</span><h3>Notes that belong to you</h3><p>Keep studies on your device, or sign in online to save a private snapshot you can restore in another browser.</p></article>
            <article><span>04</span><h3>Context with a source trail</h3><p>Explore commentary, timelines, maps, cross references, and historical witnesses without hiding provenance.</p></article>
            <article><span>05</span><h3>Desktop and mobile</h3><p>Use the full research workspace on Windows or carry an offline reading and study companion on Android.</p></article>
            <article><span>06</span><h3>A web version when you need it</h3><p>Open Living Word in a browser while keeping the downloadable editions ready for connection-free study.</p></article>
          </div>
        </section>

        <section id="download" className="marketing-download marketing-section">
          <header><p>CHOOSE YOUR EDITION</p><h2>Study online or take the library with you.</h2><span>Version 0.1.15 beta</span></header>
          <div className="marketing-download-grid">
            <article className="featured"><p>WINDOWS</p><h3>Full desktop workspace</h3><span>Reader, timeline, graph, source library, study editor, and local exports.</span><DownloadAction href={WINDOWS_DOWNLOAD_URL}>Download Windows installer</DownloadAction><small>Windows 10/11 · x64 · offline library included</small></article>
            <article><p>ANDROID</p><h3>Offline study on the go</h3><span>Reading, notes, lookup, daily plans, and the bundled reference library.</span><DownloadAction href={undefined}>Coming soon</DownloadAction><small>Android beta · APK coming soon</small></article>
            <article><p>WEB</p><h3>Open in your browser</h3><span>Read and search without an account. Sign in when you want private online study snapshots.</span><a className="marketing-button marketing-button-secondary" href="/app">Launch web app</a><small>Your studies are private by default and are never shared automatically.</small></article>
          </div>
        </section>

        <section className="marketing-principles">
          <div><p>A SIMPLE PROMISE</p><h2>Open the Bible. Take your time.</h2><span>Living Word is being made for readers—not advertisers, algorithms, or engagement targets.</span></div>
          <div><strong>The Scripture reader stays open to everyone.</strong><strong>No ads competing for your attention.</strong><strong>Your notes and studies remain yours.</strong><strong>The installed editions keep working without a connection.</strong></div>
        </section>

        <section className="marketing-faq marketing-section">
          <header><p>GOOD TO KNOW</p><h2>Questions before you begin.</h2></header>
          <details><summary>Does the installed app require internet access?</summary><p>No. The desktop and Android editions bundle the ordinary reading and study library for offline use.</p></details>
          <details><summary>Where are my notes stored?</summary><p>Your installed app keeps study data locally on your device. Export backups regularly if the notes matter to you.</p></details>
          <details><summary>Do I need an account for the web edition?</summary><p>No account is needed to read or search. Create one when you want to save a private study snapshot online and restore it in another browser.</p></details>
          <details><summary>Is Living Word finished?</summary><p>It is currently a beta. The core study experience works, while testing and source verification continue.</p></details>
          <details><summary>Where do beta testers leave feedback?</summary><p>Invited testers can open the <a href="/beta">private beta questionnaire</a>, complete it on-screen, download their answers, or print a blank or completed copy.</p></details>
          <details><summary>Does the web app replace the offline editions?</summary><p>No. It is an additional way to use Living Word. The downloadable editions remain the best choice for dependable offline study.</p></details>
        </section>
      </main>

      <footer className="marketing-footer"><div className="marketing-brand"><span>LW</span><strong>Living Word<small>Keep Scripture close.</small></strong></div><p>Offline-first Bible study for readers, teachers, and careful researchers.</p><a href="/app">Open web app →</a></footer>
    </div>
  );
}