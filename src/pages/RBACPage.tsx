import React from 'react';

const RBACPage: React.FC = () => (
  <div className="content">
      <div className="section-header">
        <div className="section-title">RBAC Management</div>
        <div className="section-line" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary">+ Add Role</button>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 10 }}>Roles</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Description</th>
                  <th>Users</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Admin</td>
                  <td>Full access to all features</td>
                  <td>3</td>
                  <td><button className="btn btn-ghost">Edit</button></td>
                </tr>
                <tr>
                  <td>QA Engineer</td>
                  <td>Manage test cases and jobs</td>
                  <td>7</td>
                  <td><button className="btn btn-ghost">Edit</button></td>
                </tr>
                <tr>
                  <td>Viewer</td>
                  <td>Read-only access</td>
                  <td>12</td>
                  <td><button className="btn btn-ghost">Edit</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 10 }}>Permissions Matrix</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>Admin</th>
                  <th>QA Engineer</th>
                  <th>Viewer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>View Dashboard</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                </tr>
                <tr>
                  <td>Manage Test Cases</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Trigger Jobs</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Manage Users</td>
                  <td>✔️</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>View Audit Logs</td>
                  <td>✔️</td>
                  <td></td>
                  <td>✔️</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
);

export default RBACPage;
