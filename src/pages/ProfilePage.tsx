
import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Session & OAuth placeholders
  const sessions = [
    { browser: 'Chrome · Pune, IN', ip: 'Current · 103.21.42.x', active: true },
    { browser: 'Safari · Mumbai, IN', ip: '2 days ago · 49.36.x.x', active: false },
  ];
  const twoFactor = true;
  const sessionTimeout = '1 hour';
  const oauth = [
    { name: 'Google', icon: '🔵', connected: true },
    { name: 'GitHub', icon: '⬛', connected: false },
  ];
  // Role badge logic
  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'qa' ? 'QA Engineer' : user?.role === 'dev' ? 'Developer' : '';
  const roleClass = user?.role === 'admin' ? 'admin' : user?.role === 'qa' ? 'qa' : user?.role === 'dev' ? 'dev' : '';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  const avatarGrad = user?.role === 'admin'
    ? 'linear-gradient(135deg, #f5a623, #e8870a)'
    : user?.role === 'qa'
    ? 'linear-gradient(135deg, #5b6ef5, #3d52d5)'
    : 'linear-gradient(135deg, #00e5a0, #00b37a)';

  return (
    <div className="content">
      <div className="section-header">
        <div className="section-title">Profile & Security</div>
        <div className="section-line" />
      </div>
      <div className="two-col" style={{ alignItems: 'flex-start', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Account Details Card */}
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent)' }}>👤</span>
              <span className="card-title">Account Details</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 22, background: avatarGrad }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{email}</div>
                  <span className={`role-badge ${roleClass}`} style={{ marginTop: 4, display: 'inline-flex' }}>{roleLabel}</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-label">Full Name</div>
                <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-label">Email</div>
                <input className="input-field" value={email} type="email" onChange={e => setEmail(e.target.value)} />
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
          {/* Change Password Card */}
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent3)' }}>🔒</span>
              <span className="card-title">Change Password</span>
            </div>
            <div className="card-body">
              <div className="input-group">
                <div className="input-label">Current Password</div>
                <input className="input-field" type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-label">New Password</div>
                <input className="input-field" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-label">Confirm New Password</div>
                <input className="input-field" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button className="btn btn-primary">Update Password</button>
            </div>
          </div>
        </div>
        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Session & Security Card */}
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent2)' }}>🛡</span>
              <span className="card-title">Session & Security</span>
            </div>
            <div className="card-body">
              <div style={{ fontSize: 13, marginBottom: 14 }}>
                <div style={{ color: 'var(--text-dim)', marginBottom: 8 }}>Active Sessions</div>
                {sessions.map((s, i) => (
                  <div key={i} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.browser}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{s.ip}</div>
                    </div>
                    {s.active ? (
                      <span style={{ fontSize: 11, background: 'rgba(0,229,160,0.1)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 20, fontFamily: 'DM Mono, monospace' }}>Active</span>
                    ) : (
                      <button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 8px' }}>Revoke</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 13 }}>Session Timeout</div>
                  <select style={{ fontSize: 12, padding: '5px 24px 5px 8px' }} value={sessionTimeout}>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>Never</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13 }}>Two-Factor Auth</div>
                  <div style={{ background: 'rgba(0,229,160,0.1)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{twoFactor ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
            </div>
          </div>
          {/* OAuth Connections Card */}
          <div className="card">
            <div className="card-header">
              <span style={{ color: 'var(--accent4)' }}>🔑</span>
              <span className="card-title">OAuth Connections</span>
            </div>
            <div className="card-body">
              {oauth.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: i === 0 ? 12 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}><span style={{ fontSize: 20 }}>{o.icon}</span> {o.name}</div>
                  {o.connected ? (
                    <div style={{ fontSize: 12, background: 'rgba(0,229,160,0.1)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 20, fontFamily: 'DM Mono, monospace' }}>Connected</div>
                  ) : (
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
