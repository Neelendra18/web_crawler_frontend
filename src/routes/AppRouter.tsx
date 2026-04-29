
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AuditLogsPage from '../pages/AuditLogsPage';
import ProfilePage from '../pages/ProfilePage';
import CrawlerPage from '../pages/CrawlerPage';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import NewCrawlPage from '../pages/NewCrawlPage';
import LiveJobsPage from '../pages/LiveJobsPage';
import TokenManagementPage from '../pages/TokenManagementPage';
import TestCasesPage from '../pages/TestCasesPage';
import ScriptGeneratorPage from '../pages/ScriptGeneratorPage';
import CICDPage from '../pages/CICDPage';
import RBACPage from '../pages/RBACPage';
import PermissionDeniedPage from '../pages/PermissionDeniedPage';

export const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Topbar />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/crawler" element={<CrawlerPage />} />
                <Route path="/new-crawl" element={<NewCrawlPage />} />
                <Route path="/live-jobs" element={<LiveJobsPage />} />
                <Route path="/tokens" element={<TokenManagementPage />} />
                <Route path="/test-cases" element={<TestCasesPage />} />
                <Route path="/scripts" element={<ScriptGeneratorPage />} />
                <Route path="/cicd" element={<CICDPage />} />
                <Route path="/rbac" element={<RBACPage />} />
                <Route path="/audit" element={<AuditLogsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/denied" element={<PermissionDeniedPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
};
