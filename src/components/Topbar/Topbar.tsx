

import React, { useState, useRef } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';


const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    }
    if (dropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdown]);

  if (!user) return null;

  const handleNav = (path: string) => {
    setDropdown(false);
    setTimeout(() => navigate(path), 100);
  };

  return (
    <header className="topbar">
      <div className="page-title">AI-Driven Test Automation Platform</div>
      <div className="topbar-right">
        <div
          className={`topbar-user${dropdown ? ' open' : ''}`}
          onClick={() => setDropdown(d => !d)}
          tabIndex={0}
          ref={dropdownRef}
        >
          <div
            className={`t-avatar ${user.role === 'admin' ? 'avatar-admin' : user.role === 'qa' ? 'avatar-qa' : 'avatar-user'}`}
          >
            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <div className="t-name">{user.name}</div>
            <div className="t-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          </div>
          {dropdown && (
            <div className="user-dropdown">
              <div className="dd-item" tabIndex={-1} onClick={e => { e.stopPropagation(); handleNav('/profile'); }}>
                <span role="img" aria-label="profile">👤</span> Profile
              </div>
              {user.role === 'admin' && (
                <div className="dd-item" tabIndex={-1} onClick={e => { e.stopPropagation(); handleNav('/rbac'); }}>
                  <span role="img" aria-label="access control">🔐</span> Access Control
                </div>
              )}
              <div className="dd-sep" />
              <div
                className="dd-item danger"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  setDropdown(false);
                  setTimeout(() => {
                    logout();
                  }, 100);
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
