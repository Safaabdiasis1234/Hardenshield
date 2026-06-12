import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import AnalyserPage from './pages/AnalyserPage.jsx'
import TermsPage from './pages/TermsPage.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyser" element={<AnalyserPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
      <Footer />
    </>
  )
}

