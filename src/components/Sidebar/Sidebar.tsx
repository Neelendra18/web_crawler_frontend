import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import './Sidebar.css';

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', icon: '⬛', roles: ['admin', 'qa', 'dev'] },
      { label: 'Audit Logs', path: '/audit', icon: '📋', roles: ['admin'], badge: 3, badgeClass: 'warn' },
    ],
  },
  {
    label: 'Crawler',
    items: [
      { label: 'New Crawl', path: '/new-crawl', icon: '🔗', roles: ['admin', 'qa'] },
      { label: 'Live Jobs', path: '/live-jobs', icon: '⚡', roles: ['admin', 'qa', 'dev'], badge: 2 },
      { label: 'Token Usage', path: '/tokens', icon: '🪙', roles: ['admin'] },
    ],
  },
  {
    label: 'Testing',
    items: [
      { label: 'Test Cases', path: '/test-cases', icon: '🧪', roles: ['admin', 'qa', 'dev'] },
      { label: 'Script Gen', path: '/scripts', icon: '⚙️', roles: ['admin', 'qa', 'dev'] },
      { label: 'CI/CD Runs', path: '/cicd', icon: '🚀', roles: ['admin', 'dev'], badge: 1, badgeClass: 'fail' },
    ],
  },
  // Removed Admin section per latest.html parity
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;
  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo">
          <div className="logo-icon">🧠</div>
          Airithm <span>AI</span>
        </div>
      </div>
      {navSections.map(section => (
        <div className="nav-section" key={section.label}>
          <div className="nav-label">{section.label}</div>
          {section.items.filter(item => item.roles.includes(user.role)).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span> {item.label}
              {item.badge && (
                <span className="badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
