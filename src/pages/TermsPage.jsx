import { Link } from 'react-router-dom'
import styles from './TermsPage.module.css'

const TOC = [
  { id: 'acceptance',    label: '1. Acceptance of Terms' },
  { id: 'permitted',     label: '2. Permitted Use' },
  { id: 'prohibited',    label: '3. Prohibited Activities' },
  { id: 'disclaimer',    label: '4. Disclaimer of Warranties' },
  { id: 'liability',     label: '5. Limitation of Liability' },
  { id: 'data',          label: '6. Data & Privacy' },
  { id: 'accuracy',      label: '7. Accuracy of Findings' },
  { id: 'ip',            label: '8. Intellectual Property' },
  { id: 'changes',       label: '9. Changes to Terms' },
  { id: 'contact',       label: '10. Contact' },
]

export default function TermsPage() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main id="terms-page" className={styles.page}>
      <div className={`container ${styles.container}`}>

        {/* Header */}
        <header className={styles.header}>
          <p className="sectionLabel">Legal</p>
          <h1 className={styles.title}>Terms of Use</h1>
          <p className={styles.meta}>
            Effective date: <time dateTime="2024-01-01">1 January 2024</time> &nbsp;·&nbsp; Last updated:{' '}
            <time dateTime="2024-11-01">1 November 2024</time>
          </p>
        </header>

        <div className={styles.layout}>

          {/* Sidebar TOC */}
          <aside className={styles.toc} aria-label="Table of contents">
            <div className={`card ${styles.tocCard}`}>
              <h2 className={styles.tocHeading}>Contents</h2>
              <nav aria-label="Jump to section">
                <ol className={styles.tocList}>
                  {TOC.map(({ id, label }) => (
                    <li key={id}>
                      <button
                        id={`toc-btn-${id}`}
                        className={styles.tocLink}
                        onClick={() => scrollTo(id)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          {/* Body */}
          <div className={styles.body}>

            {/* Warning box */}
            <div className={styles.warning} role="alert">
              <div className={styles.warningIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <strong className={styles.warningTitle}>Authorised Use Only</strong>
                <p className={styles.warningText}>
                  HardenShield is a security advisory tool intended for use by authorised
                  system owners, IT administrators, and security professionals on systems
                  they own or have explicit written permission to assess. Unauthorised use
                  against third-party systems may constitute a criminal offence under the
                  Computer Misuse Act 1990, the Computer Fraud and Abuse Act, or equivalent
                  legislation in your jurisdiction.
                </p>
              </div>
            </div>

            {/* Sections */}
            <section className={styles.section} aria-labelledby="acceptance">
              <h2 id="acceptance" className={styles.sectionTitle}>1. Acceptance of Terms</h2>
              <p>
                By accessing or using HardenShield (&ldquo;the Service&rdquo;), you agree to be bound
                by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you must
                immediately cease using the Service. These Terms constitute a legally binding
                agreement between you and HardenShield (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
              </p>
              <p>
                These Terms apply to all users of the Service, including without limitation,
                users who are browsers, analysts, IT professionals, or contributors of content.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="permitted">
              <h2 id="permitted" className={styles.sectionTitle}>2. Permitted Use</h2>
              <p>You may use HardenShield solely for the following purposes:</p>
              <ul className={styles.list}>
                <li>Assessing the security posture of systems you own or administer.</li>
                <li>Conducting authorised security audits with written consent from the system owner.</li>
                <li>Educational and research purposes on isolated lab environments.</li>
                <li>Generating hardening reports for regulatory compliance documentation (e.g., NIS2, NCSC Cyber Essentials).</li>
                <li>Providing professional security advisory services to clients, where authorisation has been obtained.</li>
              </ul>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="prohibited">
              <h2 id="prohibited" className={styles.sectionTitle}>3. Prohibited Activities</h2>
              <p>You must not use the Service to:</p>
              <ul className={`${styles.list} ${styles.listWarn}`}>
                <li>Analyse systems you do not own or lack explicit written authorisation to test.</li>
                <li>Develop, facilitate, or assist offensive cyber capabilities or malware.</li>
                <li>Circumvent, disable, or interfere with security features of any system.</li>
                <li>Conduct or facilitate attacks against critical national infrastructure.</li>
                <li>Redistribute, resell, or sublicense the Service without written authorisation.</li>
                <li>Attempt to reverse-engineer, decompile, or extract proprietary algorithms from the Service.</li>
                <li>Input personally identifiable information (PII) or classified data into the analysis context field.</li>
              </ul>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="disclaimer">
              <h2 id="disclaimer" className={styles.sectionTitle}>4. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties
                of any kind, express or implied. To the fullest extent permitted by applicable law,
                we disclaim all warranties, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p>
                We do not warrant that: (a) the Service will be uninterrupted or error-free;
                (b) findings will be complete, accurate, or up-to-date; (c) the Service will
                meet your specific security requirements; or (d) any remediation steps provided
                will be appropriate or effective in your specific environment.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="liability">
              <h2 id="liability" className={styles.sectionTitle}>5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, HardenShield and its officers, directors,
                employees, and agents shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including but not limited to loss of profits,
                data, goodwill, or other intangible losses, arising from:
              </p>
              <ul className={styles.list}>
                <li>Your use of, or inability to use, the Service.</li>
                <li>Reliance on findings, recommendations, or fix commands provided by the Service.</li>
                <li>System downtime, data loss, or security incidents following the application of remediation steps.</li>
                <li>Unauthorised access to or alteration of your transmissions or data.</li>
              </ul>
              <p>
                In jurisdictions that do not allow the exclusion or limitation of liability for
                consequential damages, our liability is limited to the maximum extent permitted by law.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="data">
              <h2 id="data" className={styles.sectionTitle}>6. Data &amp; Privacy</h2>
              <p>
                HardenShield processes the data you submit (operating system selection, service
                configuration, and context text) solely to generate the analysis report. We do not:
              </p>
              <ul className={styles.list}>
                <li>Permanently store your submitted analysis inputs beyond the active session.</li>
                <li>Share your input data with third parties for commercial purposes.</li>
                <li>Use submitted data to train machine learning models without explicit consent.</li>
              </ul>
              <p>
                You are responsible for ensuring that any context information you submit does not
                contain confidential, classified, or personally identifiable information. Do not
                submit IP addresses, hostnames, credentials, or network topology details.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="accuracy">
              <h2 id="accuracy" className={styles.sectionTitle}>7. Accuracy of Findings</h2>
              <p>
                CVE and vulnerability data is sourced from publicly available databases including
                the National Vulnerability Database (NVD) and MITRE CVE. While we strive to keep
                this information current, CVE severity ratings, patch availability, and exploit
                status change frequently. You should always verify findings against the latest NVD
                entries and vendor advisories before implementing remediation.
              </p>
              <p>
                The risk score produced by HardenShield is an indicative metric based on weighted
                severity calculations and should not be used as the sole basis for security
                decision-making. A formal penetration test or security audit by a qualified
                practitioner should accompany any significant remediation programme.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="ip">
              <h2 id="ip" className={styles.sectionTitle}>8. Intellectual Property</h2>
              <p>
                All content, software, algorithms, design elements, and documentation comprising
                HardenShield are the exclusive intellectual property of HardenShield and its
                licensors. Nothing in these Terms grants you any right, title, or interest in
                the Service beyond the limited licence to use it as described herein.
              </p>
              <p>
                CVE identifiers are maintained by MITRE Corporation. NVD data is maintained by
                NIST. These are referenced under fair use for informational and security advisory
                purposes only.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="changes">
              <h2 id="changes" className={styles.sectionTitle}>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective
                immediately upon posting to this page. The &ldquo;Last updated&rdquo; date at the top of this
                page will be revised accordingly. Your continued use of the Service after any
                changes constitutes your acceptance of the new Terms. We encourage you to review
                these Terms periodically.
              </p>
            </section>

            <div className="divider" />

            <section className={styles.section} aria-labelledby="contact">
              <h2 id="contact" className={styles.sectionTitle}>10. Contact</h2>
              <p>
                If you have questions about these Terms, wish to report a misuse concern, or
                require clarification on permitted use for a specific engagement, please contact:
              </p>
              <div className={`card ${styles.contactBlock}`}>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>General Enquiries</span>
                  <span className={styles.contactValue}>legal@hardenshield.io</span>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Security Reports</span>
                  <span className={styles.contactValue}>security@hardenshield.io</span>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Abuse Reports</span>
                  <span className={styles.contactValue}>abuse@hardenshield.io</span>
                </div>
              </div>
            </section>

            {/* Footer Nav */}
            <div className={styles.footerNav}>
              <Link to="/" id="terms-back-home" className="btn btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Home
              </Link>
              <Link to="/analyser" id="terms-go-analyser" className="btn btn-primary">
                Start Analysis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
