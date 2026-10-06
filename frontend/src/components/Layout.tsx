import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const navItems = [
  { path: '/', icon: '🏠', labelKey: 'nav.home' },
  { path: '/quiz', icon: '📝', labelKey: 'nav.quiz' },
  { path: '/game', icon: '🎒', labelKey: 'nav.game' },
  { path: '/flood-game', icon: '🌊', labelKey: 'nav.floodGame' },
  { path: '/community', icon: '🤝', labelKey: 'nav.community' },
  { path: '/volunteers', icon: '🙋', labelKey: 'nav.volunteers' },
  { path: '/preparedness', icon: '📚', labelKey: 'nav.preparedness' },
  { path: '/recovery', icon: '🔧', labelKey: 'nav.recovery' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">🛡️</span>
          <span className="sidebar-title">{t('app_name')}</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="lang-toggle" style={{ marginBottom: '12px' }}>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
            <button
              className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
              onClick={() => setLang('hi')}
            >हिं</button>
            <button 
              className="lang-btn" 
              onClick={toggleTheme} 
              style={{ marginLeft: 'auto', fontSize: '1.2rem', background: 'transparent' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <button className="btn btn-outline btn-sm sidebar-logout" onClick={handleLogout}>
            {t('nav.logout')}
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
