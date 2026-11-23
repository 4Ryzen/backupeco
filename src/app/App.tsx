import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EcoHeader } from './components/EcoHeader';
import { HeroSection } from './components/HeroSection';
import { SolutionSection } from './components/SolutionSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { EcoFooter } from './components/EcoFooter';
import { AuthProvider } from './AuthContext';
import { Login } from './Login';
import { Signup } from './Signup';
import SupportPage from './SupportPage';
import ProfilePage from './ProfilePage';
import DashboardPage from './DashboardPage';
import ReportsPage from './ReportsPage';

function MainApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <EcoHeader onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} />
      <HeroSection />
      <SolutionSection />
      <HowItWorksSection />
      <EcoFooter />
      {showLogin && (
        <Login
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
      {showSignup && (
        <Signup
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onClose={() => setShowSignup(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/suporte" element={<SupportPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}