import { useState, useRef, useEffect } from 'react'
import {
  OS_OPTIONS, OS_EOL, SERVICE_OPTIONS,
  FINDING_DB, SEV_ORDER, SCAN_STEPS,
  callHardenAPI,
} from '../data/vulnerabilities.js'
import styles from './AnalyserPage.module.css'

/* ── Step indicator ───────────────────────────────────────────────────────── */
function StepIndicator({ step, current }) {
  const done   = current > step
  const active = current === step
  return (
    <div className={`${styles.stepItem} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
      <div className={styles.stepCircle} aria-label={done ? 'Completed' : active ? 'Current step' : 'Upcoming'}>
        {done
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          : <span>{step}</span>}
      </div>
      <span className={styles.stepLabel}>
        {step === 1 ? 'System' : step === 2 ? 'Services' : 'Context'}
      </span>
    </div>
  )
}

/* ── Scan loader ──────────────────────────────────────────────────────────── */
function ScanLoader({ currentStep }) {
  return (
    <div className={styles.scanLoader} role="status" aria-live="polite" aria-label="Analysis in progress">
      <div className={styles.dualRing} aria-hidden="true">
        <div className={`${styles.ring} ${styles.ringOuter}`} />
        <div className={`${styles.ring} ${styles.ringInner}`} />
        <div className={styles.ringDot} />
      </div>
      <p className={styles.scanTitle}>Analysing System Configuration</p>
      <p className={styles.scanStepText} key={currentStep}>
        {SCAN_STEPS[Math.min(currentStep, SCAN_STEPS.length - 1)]}
      </p>
      <div className={styles.scanLog} aria-label="Scan progress log">
        {SCAN_STEPS.slice(0, currentStep + 1).map((s, i) => (
          <div key={i} className={`${styles.scanLogLine} ${i === currentStep ? styles.scanLogActive : ''}`}>
            <span className={styles.scanLogPrefix} aria-hidden="true">{i < currentStep ? '✓' : '›'}</span>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Risk gauge ───────────────────────────────────────────────────────────── */
function RiskGauge({ score }) {
  const colour =
    score >= 70 ? 'var(--color-critical)' :
    score >= 40 ? 'var(--color-high)'     : 'var(--color-medium)'

  const label =
    score >= 70 ? 'Critical Risk' :
    score >= 40 ? 'High Risk'     :
    score >= 20 ? 'Medium Risk'   : 'Low Risk'

  return (
    <div className={styles.riskGauge} aria-label={`Risk score: ${score}/100 — ${label}`}>
      <div className={styles.gaugeTop}>
        <div>
          <span className={styles.scoreNum} style={{ color: colour }}>{score}</span>
          <span className={styles.scoreSlash}>/100</span>
        </div>
        <div
          className={styles.riskLabel}
          style={{ color: colour, background: `${colour}18`, border: `1px solid ${colour}40` }}
        >
          {label}
        </div>
      </div>
      <div
        className={styles.barTrack}
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.barFill}
          style={{
            '--target-width': `${score}%`,
            background: `linear-gradient(90deg, var(--color-indigo) 0%, ${colour} 100%)`,
            animation: 'progress-fill 1.2s var(--ease-out) forwards',
          }}
        />
      </div>
      <div className={styles.barLabels} aria-hidden="true">
        <span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
      </div>
    </div>
  )
}

/* ── Finding card ─────────────────────────────────────────────────────────── */
function FindingCard({ finding }) {
  const [open, setOpen]     = useState(false)
  const [copied, setCopied] = useState(false)

  const badgeClass =
    finding.severity === 'Critical' ? 'badge-critical' :
    finding.severity === 'High'     ? 'badge-high'     : 'badge-medium'

  const handleCopy = () => {
    navigator.clipboard.writeText(finding.fixCommand.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <article
      className={`card ${styles.findingCard} ${styles[`sev${finding.severity}`]} ${open ? styles.findingCardOpen : ''}`}
      aria-expanded={open}
    >
      <button
        id={`finding-toggle-${finding.id}`}
        className={styles.findingHeader}
        onClick={() => setOpen(o => !o)}
        aria-controls={`finding-body-${finding.id}`}
      >
        <div className={styles.findingHeaderLeft}>
          <span className={`badge ${badgeClass}`}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {finding.severity}
          </span>
          <h3 className={styles.findingTitle}>{finding.title}</h3>
        </div>
        <div className={styles.findingHeaderRight}>
          <code className={styles.findingCve}>{finding.cve}</code>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
      </button>

      <div
        id={`finding-body-${finding.id}`}
        className={`${styles.findingBody} ${open ? styles.findingBodyOpen : ''}`}
      >
        <div className="divider" style={{ margin: '0 0 18px' }} />
        <p className={styles.findingDesc}>{finding.description}</p>

        <div className={styles.remediation}>
          <h4 className={styles.remTitle}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Remediation Steps
          </h4>
          <ol className={styles.remList}>
            {finding.remediation.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>

        <div className={styles.fixBlock}>
          <div className={styles.fixHeader}>
            <span className={styles.langTag}>{finding.fixCommand.lang}</span>
            <button
              id={`copy-btn-${finding.id}`}
              className={`${styles.copyBtn} ${copied ? styles.copyDone : ''}`}
              onClick={handleCopy}
              aria-label="Copy fix command to clipboard"
            >
              {copied
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
                : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
              }
            </button>
          </div>
          <pre className="codeBlock"><code>{finding.fixCommand.code}</code></pre>
        </div>
      </div>
    </article>
  )
}

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function AnalyserPage() {
  const [step,     setStep]     = useState(1)
  const [os,       setOs]       = useState('')
  const [services, setServices] = useState([])
  const [context,  setContext]  = useState('')
  const [phase,    setPhase]    = useState('form') // 'form' | 'scanning' | 'results'
  const [scanStep, setScanStep] = useState(0)
  const [results,  setResults]  = useState(null)
  const [error,    setError]    = useState(null)
  const resultsRef = useRef(null)

  // Drive scan log animation
  useEffect(() => {
    if (phase !== 'scanning') return
    setScanStep(0)
    let i = 0
    const iv = setInterval(() => {
      i++
      setScanStep(i)
      if (i >= SCAN_STEPS.length - 1) clearInterval(iv)
    }, 480)
    return () => clearInterval(iv)
  }, [phase])

  const toggleService = (key) => {
    setServices(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const handleSubmit = async () => {
    if (!os || services.length === 0) return
    setError(null)
    setPhase('scanning')
    try {
      const data   = await callHardenAPI(os, services, context)
      const sorted = [...data.findings].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity])
      
      // Generate a unique report ID for tracking/support
      const randNum = Math.floor(1000 + Math.random() * 9000)
      const randHex = Math.random().toString(36).substring(2, 6).toUpperCase()
      const reportId = `HS-${randNum}-${randHex}`

      setResults({ ...data, findings: sorted, reportId, date: new Date().toLocaleDateString() })
      setPhase('results')
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setError('Analysis failed. Please try again.')
      setPhase('form')
    }
  }

  const handleReset = () => {
    setPhase('form'); setStep(1); setOs(''); setServices([])
    setContext(''); setResults(null); setError(null)
  }

  const handlePrint = () => {
    window.print()
  }

  const canProceed1 = os !== ''
  const canProceed2 = services.length > 0

  return (
    <main id="analyser-page" className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className="container">

        {/* Header */}
        <header className={styles.header}>
          <p className="sectionLabel">AI Hardening Analyser</p>
          <h1 className={styles.title}>System Hardening Analysis</h1>
          <p className={styles.subtitle}>
            Select your OS, flag exposed services, and optionally provide infrastructure context
            for a tailored CVE-mapped hardening report.
          </p>
        </header>

        {/* Step progress */}
        {phase === 'form' && (
          <div className={styles.stepProgress} role="navigation" aria-label="Form steps">
            {[1,2,3].map(s => <StepIndicator key={s} step={s} current={step} />)}
            <div className={styles.stepTrack} aria-hidden="true">
              <div className={styles.stepTrackFill} style={{ width: `${((step - 1) / 2) * 100}%` }} />
            </div>
          </div>
        )}

        {/* ── FORM ─────────────────────────────────────────────────────── */}
        {phase === 'form' && (
          <div className={styles.form}>

            {/* Step 1 — OS */}
            {step === 1 && (
              <section className={styles.formStep} style={{ animation: 'fade-in 0.3s var(--ease-out)' }} aria-labelledby="step1-heading">
                <h2 id="step1-heading" className={styles.stepTitle}>
                  <span className={styles.stepNum}>01</span>Select Operating System
                </h2>
                <p className={styles.stepDesc}>
                  Choose the OS on the target system. Legacy versions carry OS-specific risk multipliers.
                </p>

                <div className={styles.osGrid} role="radiogroup" aria-label="Operating system">
                  {OS_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      id={`os-btn-${opt.replace(/\s+/g,'-').toLowerCase()}`}
                      role="radio"
                      aria-checked={os === opt}
                      className={`${styles.osCard} ${os === opt ? styles.osCardSelected : ''}`}
                      onClick={() => setOs(opt)}
                    >
                      <div className={styles.osIcon} aria-hidden="true">
                        {opt.startsWith('Windows') || opt.startsWith('Win')
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
                          : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021C7.309.094 3.248.8.813 6.021c-1.498 3.185-1.492 6.9 0 10.135 1.435 3.237 4.5 5.348 7.47 5.884.07.014.14.014.21.007.425-.056.718-.462.648-.89a13.82 13.82 0 0 0-.05-.5 44.888 44.888 0 0 1 0-10 44.838 44.838 0 0 1 .048-.5c.07-.43-.22-.835-.648-.89-.07-.007-.14-.007-.21.007C4.47 10.852 1.5 8.742.063 5.505c-.547-1.233-.737-2.564-.577-3.87.098-.793.793-1.35 1.574-1.237L12.29.57c.07.007.14.007.21 0 .07-.007.14-.007.21 0L24 3.47a13.97 13.97 0 0 0-.063 5.505c-1.435 3.237-4.5 5.348-7.47 5.884-.07.014-.14.014-.21.007-.425-.056-.718-.462-.648-.89a13.82 13.82 0 0 0 .05-.5 44.888 44.888 0 0 0 0-10 44.838 44.838 0 0 0-.048-.5c-.07-.43.22-.835.648-.89.07-.007.14-.007.21.007 2.97.536 6.035 2.647 7.47 5.884 1.435 3.185 1.492 6.9 0 10.135C21.752 23.2 17.69 23.907 13.024 23.979A8.4 8.4 0 0 1 12.504 24z"/></svg>
                        }
                      </div>
                      <span className={styles.osName}>{opt}</span>
                      {OS_EOL.has(opt) && <span className={styles.eolTag} aria-label="End of life">EOL</span>}
                      {os === opt && (
                        <span className={styles.osCheck} aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className={styles.actions}>
                  <button id="step1-next" className="btn btn-primary" onClick={() => setStep(2)} disabled={!canProceed1}>
                    Next: Services
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </section>
            )}

            {/* Step 2 — Services */}
            {step === 2 && (
              <section className={styles.formStep} style={{ animation: 'fade-in 0.3s var(--ease-out)' }} aria-labelledby="step2-heading">
                <h2 id="step2-heading" className={styles.stepTitle}>
                  <span className={styles.stepNum}>02</span>Exposed Services
                </h2>
                <p className={styles.stepDesc}>Select all services currently running or exposed on the target.</p>

                <div className={styles.servicesGrid} role="group" aria-label="Service selection">
                  {SERVICE_OPTIONS.map(({ key, label, cve, severity }) => {
                    const checked = services.includes(key)
                    const bc = severity === 'Critical' ? 'badge-critical' : severity === 'High' ? 'badge-high' : 'badge-medium'
                    return (
                      <button
                        key={key}
                        id={`service-btn-${key}`}
                        role="checkbox"
                        aria-checked={checked}
                        className={`${styles.serviceCard} ${checked ? styles.serviceCardSelected : ''}`}
                        onClick={() => toggleService(key)}
                      >
                        <div className={styles.serviceTop}>
                          <div className={`${styles.checkBox} ${checked ? styles.checkBoxChecked : ''}`} aria-hidden="true">
                            {checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <span className={`badge ${bc}`}>{severity}</span>
                        </div>
                        <div className={styles.serviceName}>{label}</div>
                        <div className={styles.serviceCve}>{cve}</div>
                      </button>
                    )
                  })}
                </div>

                <div className={styles.actions}>
                  <button id="step2-back" className="btn btn-ghost" onClick={() => setStep(1)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                  <button id="step2-next" className="btn btn-primary" onClick={() => setStep(3)} disabled={!canProceed2}>
                    Next: Context
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </section>
            )}

            {/* Step 3 — Context */}
            {step === 3 && (
              <section className={styles.formStep} style={{ animation: 'fade-in 0.3s var(--ease-out)' }} aria-labelledby="step3-heading">
                <h2 id="step3-heading" className={styles.stepTitle}>
                  <span className={styles.stepNum}>03</span>Infrastructure Context
                </h2>
                <p className={styles.stepDesc}>
                  Optionally describe your environment. This context is passed to the analysis engine.
                </p>

                {/* Summary */}
                <div className={`card ${styles.summary}`}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Operating System</span>
                    <span className={styles.summaryValue}>{os}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Services</span>
                    <div className={styles.summaryServices}>
                      {services.map(k => {
                        const svc = SERVICE_OPTIONS.find(s => s.key === k)
                        const bc  = svc?.severity === 'Critical' ? 'badge-critical' : svc?.severity === 'High' ? 'badge-high' : 'badge-medium'
                        return <span key={k} className={`badge ${bc}`}>{svc?.label}</span>
                      })}
                    </div>
                  </div>
                </div>

                <div className={styles.contextField}>
                  <label htmlFor="context-textarea" className={styles.contextLabel}>
                    Additional Context <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="context-textarea"
                    className={styles.textarea}
                    rows={5}
                    placeholder="e.g. This Windows XP system controls a SCADA PLC in an air-gapped factory network…"
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    maxLength={1000}
                  />
                  <div className={styles.charCount}>{context.length}/1000</div>
                </div>

                {error && <div className={styles.errorBanner} role="alert">{error}</div>}

                <div className={styles.actions}>
                  <button id="step3-back" className="btn btn-ghost" onClick={() => setStep(2)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                  <button id="step3-submit" className="btn btn-primary" onClick={handleSubmit} disabled={!canProceed1 || !canProceed2}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    Run Analysis
                  </button>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── SCANNING ────────────────────────────────────────────────── */}
        {phase === 'scanning' && (
          <div className={styles.scanPhase} style={{ animation: 'fade-in 0.3s var(--ease-out)' }}>
            <ScanLoader currentStep={scanStep} />
          </div>
        )}

        {/* ── RESULTS ─────────────────────────────────────────────────── */}
        {phase === 'results' && results && (
          <div className={styles.resultsPhase} ref={resultsRef} style={{ animation: 'fade-in 0.4s var(--ease-out)' }}>
            <div className={styles.resultsHeader}>
              <div>
                <p className="sectionLabel">Analysis Complete</p>
                <h2 className={styles.resultsTitle}>Hardening Report</h2>
                <p className={styles.resultsMeta}>
                  Target: <strong>{os}</strong> — {results.findings.length} finding{results.findings.length !== 1 ? 's' : ''} detected
                </p>
                <p className={styles.reportTracker}>
                  Report ID: <code className={styles.trackerId}>{results.reportId}</code> &nbsp;·&nbsp; Generated: {results.date}
                </p>
              </div>
              <div className={styles.resultsActions}>
                <button id="results-print-btn" className="btn btn-ghost" onClick={handlePrint}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Export PDF / Print
                </button>
                <button id="results-reset-btn" className="btn btn-primary" onClick={handleReset}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
                  </svg>
                  New Analysis
                </button>
              </div>
            </div>

            <div className={styles.printableContextBlock}>
              <h4 className={styles.printHeading}>Infrastructure Analysis Details</h4>
              <p>This automated configuration audit matches EOL operating environments with known security weaknesses, applying custom severity coefficients to calculate overall exposure.</p>
              {context && (
                <div className={styles.printContextBox}>
                  <strong>Operational Context Provided:</strong>
                  <p>{context}</p>
                </div>
              )}
            </div>

            <RiskGauge score={results.score} />

            <div className={styles.sevSummary}>
              {['Critical','High','Medium'].map(sev => {
                const count = results.findings.filter(f => f.severity === sev).length
                if (!count) return null
                const bc = sev === 'Critical' ? 'badge-critical' : sev === 'High' ? 'badge-high' : 'badge-medium'
                return (
                  <div key={sev} className={`badge ${bc} ${styles.sevChip}`}>
                    <span className={styles.sevCount}>{count}</span>{sev}
                  </div>
                )
              })}
            </div>

            <div className={styles.findingsList} role="list" aria-label="Security findings">
              {results.findings.map(f => <FindingCard key={f.id} finding={f} />)}
            </div>

            {results.findings.length === 0 && (
              <div className={`card ${styles.noFindings}`}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-medium)" strokeWidth="1.5" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>No vulnerabilities detected for the selected configuration.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
