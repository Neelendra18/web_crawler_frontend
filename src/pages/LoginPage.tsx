
import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../providers/AuthProvider';

const DEMO_USERS = [
  { name: 'Arjun Kulkarni', email: 'arjun@crawliq.io', role: 'admin', initials: 'AK', avatarClass: 'demo-av-admin', roleClass: 'admin', roleLabel: 'Admin' },
  { name: 'Meera Sharma', email: 'meera@crawliq.io', role: 'qa', initials: 'MS', avatarClass: 'demo-av-qa', roleClass: 'qa', roleLabel: 'QA Engineer' },
  { name: 'Rohan Joshi', email: 'rohan@crawliq.io', role: 'dev', initials: 'RJ', avatarClass: 'demo-av-dev', roleClass: 'dev', roleLabel: 'Developer' },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Mimic latest.html: use IDs, show/hide error, and handle demo login
  const doLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email === email);
      if (user && password === 'password') {
        setError('');
        login({ name: user.name, email: user.email, role: user.role });
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  const demoLogin = (role: string) => {
    setLoading(true);
    setTimeout(() => {
      setError('');
      const user = DEMO_USERS.find(u => u.role === role);
      if (user) login({ name: user.name, email: user.email, role: user.role });
      setLoading(false);
    }, 400);
  };

  return (
    <div id="auth-gate">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">🧠</div>
          <div>
            <div className="login-logo-text">Airithm <span>AI</span></div>
            <div className="login-tagline">AI-Driven Test Automation Platform</div>
          </div>
        </div>
        <div className="login-heading">Welcome back</div>
        <div className="login-subheading">Sign in to your workspace to continue.</div>
        <div className={error ? 'login-error show' : 'login-error'} id="login-error">
          <span>⚠</span> <span id="login-error-msg">{error || 'Invalid credentials. Please try again.'}</span>
        </div>
        <div className="login-field">
          <label className="login-label" htmlFor="l-email">Email address</label>
          <input
            className={`login-input${error ? ' err' : ''}`}
            id="l-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="login-field">
          <label className="login-label" htmlFor="l-pass">Password</label>
          <input
            className={`login-input${error ? ' err' : ''}`}
            id="l-pass"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          className={`login-btn${loading ? ' loading' : ''}`}
          id="login-btn"
          onClick={doLogin}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="login-divider">or sign in with a demo account</div>
        <div className="demo-accounts">
          {DEMO_USERS.map(user => (
            <div
              className="demo-account"
              key={user.email}
              onClick={() => demoLogin(user.role)}
              style={{ pointerEvents: loading ? 'none' : undefined, opacity: loading ? 0.7 : 1 }}
            >
              <div className="demo-account-left">
                <div className={`demo-avatar ${user.avatarClass}`}>{user.initials}</div>
                <div>
                  <div className="demo-account-name">{user.name}</div>
                  <div className="demo-account-email">{user.email}</div>
                </div>
              </div>
              <span className={`demo-role-chip ${user.roleClass}`}>{user.roleLabel}</span>
            </div>
          ))}
        </div>
        <div className="login-footer">
          Protected by <strong>Airithm AI SSO</strong> · v2.4.1
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
