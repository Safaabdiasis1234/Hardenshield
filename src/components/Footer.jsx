import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M14 2L4 7v7c0 6.1 4.3 11.8 10 13.2C19.7 25.8 24 20.1 24 14V7L14 2z"
              fill="rgba(79,70,229,0.2)"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M14 8l-6 3v4.5c0 3.6 2.6 7 6 7.9 3.4-.9 6-4.3 6-7.9V11L14 8z" fill="rgba(79,70,229,0.4)" />
            <path d="M11.5 14.5l2 2 4-4" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>HardenShield</span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/"         className={styles.link}>Home</Link>
          <Link to="/analyser" className={styles.link}>Analyser</Link>
          <Link to="/terms"    className={styles.link}>Terms of Use</Link>
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} HardenShield. Authorised use only.
        </p>
      </div>
    </footer>
  )
}
