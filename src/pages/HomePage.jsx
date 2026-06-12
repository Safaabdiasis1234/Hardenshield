import { Link } from 'react-router-dom'
import { useGridCanvas } from '../hooks/useGridCanvas.js'
import styles from './HomePage.module.css'

const FEATURES = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'CVE-Mapped Findings',
    desc: 'Every detected vulnerability is cross-referenced against the NVD and MITRE CVE database with CVSS scores and exploit status.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: 'AI-Powered Context',
    desc: 'Submit free-form infrastructure context. The engine correlates your environment against known attack patterns specific to your OS and services.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Quantified Risk Score',
    desc: 'A 0–100 risk score computed from severity weights and OS-specific multipliers, giving you a single prioritisation metric.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    title: 'Executable Fix Commands',
    desc: 'Copy-paste PowerShell or Bash remediation scripts for every finding — tested against exact OS profiles supported.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Legacy OS Profiles',
    desc: 'Purpose-built for end-of-life systems: Windows XP SP3, Windows Server 2003, CentOS 6 — systems still running in critical infrastructure.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Sub-10s Analysis',
    desc: 'Cloud-scale backend returns actionable findings in under 10 seconds — no lengthy scans, no agents on target systems.',
  },
]

const METRICS = [
  { value: '2,400+', label: 'CVEs Mapped'    },
  { value: '12',     label: 'OS Profiles'    },
  { value: '180+',   label: 'Security Checks'},
  { value: '<10s',   label: 'Analysis Time'  },
]

const TRUST_BADGES = ['CVE Database', 'MITRE ATT&CK', 'NVD Linked', 'NCSC Aligned']

function DashboardMockup() {
  return (
    <div className={`card ${styles.mockup}`} role="img" aria-label="HardenShield dashboard preview">
      {/* Chrome bar */}
      <div className={styles.mockupChrome}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dotRed}`}    />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`}  />
        </div>
        <div className={styles.urlBar}>hardenshield.io/analyser</div>
      </div>

      {/* Body */}
      <div className={styles.mockupBody}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarBrand}>
            <svg width="14" height="14" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M14 2L4 7v7c0 6.1 4.3 11.8 10 13.2C19.7 25.8 24 20.1 24 14V7L14 2z"
                fill="rgba(79,70,229,0.3)" stroke="#4f46e5" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            HardenShield
          </div>
          {['Dashboard','Analyser','Reports','Settings'].map((item, i) => (
            <div key={item} className={`${styles.sidebarItem} ${i === 1 ? styles.sidebarItemActive : ''}`}>
              {item}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className={styles.mockupContent}>
          <div className={styles.widgetRow}>
            <div className={styles.widget}>
              <div className={styles.widgetLabel}>Risk Score</div>
              <div className={`${styles.widgetScore} ${styles.scoreCritical}`}>82</div>
              <div className={styles.scoreBar}><div className={styles.scoreBarFill} style={{ width: '82%' }} /></div>
            </div>
            <div className={styles.widget}>
              <div className={styles.widgetLabel}>Findings</div>
              <div className={styles.widgetNum}>6</div>
              <span className="badge badge-critical">2 Critical</span>
            </div>
            <div className={styles.widget}>
              <div className={styles.widgetLabel}>OS Profile</div>
              <div className={`${styles.widgetNum} ${styles.osName}`}>Win XP SP3</div>
              <div className={styles.eolTag}>EOL</div>
            </div>
          </div>

          <div className={styles.findingsList}>
            {[
              { title: 'SMBv1 — CVE-2017-0144',    col: 'var(--color-critical)', sev: 'Critical' },
              { title: 'RDP Exposed — CVE-2019-0708', col: 'var(--color-critical)', sev: 'Critical' },
              { title: 'Telnet — CWE-312',          col: 'var(--color-high)',     sev: 'High' },
              { title: 'FTP Active — CWE-319',      col: 'var(--color-high)',     sev: 'High' },
            ].map(({ title, col, sev }) => (
              <div key={title} className={styles.findingRow}>
                <span className={styles.findingDot} style={{ background: col }} />
                <span className={styles.findingTitle}>{title}</span>
                <span className={styles.findingSev} style={{ color: col }}>{sev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const canvasRef = useGridCanvas()

  return (
    <main id="home-page">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.heroGradient} aria-hidden="true" />

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <p className="sectionLabel">Critical Infrastructure Security</p>

            <h1 id="hero-heading" className={styles.heroTitle}>
              Harden Legacy Systems
              <span className="gradientText"> Before They're Exploited</span>
            </h1>

            <p className={styles.heroDesc}>
              HardenShield is an AI-powered hardening advisor built for critical national
              infrastructure. Detect CVEs, assess risk, and receive executable fix commands
              for end-of-life systems that can't be patched.
            </p>

            <div className={styles.heroActions}>
              <Link to="/analyser" id="hero-cta-primary" className="btn btn-primary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Start Analysis
              </Link>
              <Link to="/terms" id="hero-cta-secondary" className="btn btn-ghost btn-lg">
                Terms of Use
              </Link>
            </div>

            <div className={styles.trust}>
              {TRUST_BADGES.map(b => (
                <span key={b} className={styles.trustBadge}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.heroRight}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── Metrics bar ──────────────────────────────────────────────── */}
      <section className={styles.metricsBar} aria-label="Platform metrics">
        <div className={`container ${styles.metricsInner}`}>
          {METRICS.map(({ value, label }) => (
            <div key={label} className={styles.metricItem}>
              <span className={styles.metricValue}>{value}</span>
              <span className={styles.metricLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className={styles.featuresSection} aria-labelledby="features-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="sectionLabel">Capabilities</p>
            <h2 id="features-heading" className={styles.sectionTitle}>
              Purpose-built for legacy environments
            </h2>
            <p className={styles.sectionDesc}>
              Unlike generic vulnerability scanners, HardenShield is engineered specifically
              for the realities of critical infrastructure — where OS upgrades are impossible
              and downtime is unacceptable.
            </p>
          </div>

          <div className={styles.featuresGrid} role="list">
            {FEATURES.map(({ icon, title, desc }) => (
              <article key={title} className={`card ${styles.featureCard}`} role="listitem">
                <div className={styles.featureIcon} aria-hidden="true">{icon}</div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────── */}
      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className="container">
          <div className={`card ${styles.ctaInner}`}>
            <div className={styles.ctaGlow} aria-hidden="true" />
            <div className={styles.ctaContent}>
              <h2 id="cta-heading" className={styles.ctaTitle}>
                Ready to harden your infrastructure?
              </h2>
              <p className={styles.ctaDesc}>
                Select your OS, flag exposed services, and receive a full CVE-mapped
                hardening report in seconds.
              </p>
              <Link to="/analyser" id="cta-banner-btn" className="btn btn-primary btn-lg">
                Run Free Analysis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
