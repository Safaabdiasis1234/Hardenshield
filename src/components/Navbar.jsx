import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NAV_LINKS = [
    { to: '/',         label: 'Home',     end: true },
    { to: '/analyser', label: 'Analyser', end: false },
    { to: '/terms',    label: 'Terms',    end: false },
  ]

  return (
    <nav
      id="main-nav"
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={`container ${styles.inner}`}>

        {/* Logo */}
        <Link to="/" id="nav-logo-link" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M14 2L4 7v7c0 6.1 4.3 11.8 10 13.2C19.7 25.8 24 20.1 24 14V7L14 2z"
              fill="rgba(79,70,229,0.2)" stroke="#4f46e5" strokeWidth="1.5" strokeLinejoin="round"
            />
            <path d="M14 8l-6 3v4.5c0 3.6 2.6 7 6 7.9 3.4-.9 6-4.3 6-7.9V11L14 8z" fill="rgba(79,70,229,0.4)" />
            <path d="M11.5 14.5l2 2 4-4" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.logoText}>
            Harden<span className={styles.logoAccent}>Shield</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links} role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              id={`nav-link-${label.toLowerCase()}`}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className={styles.cta}>
          <Link to="/analyser" id="nav-cta-btn" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Run Analysis
          </Link>

          <button
            id="nav-mobile-toggle"
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu} role="navigation" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className={styles.mobileCta}>
            <Link to="/analyser" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Run Analysis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
