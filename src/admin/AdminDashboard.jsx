// AdminDashboard.jsx
import { Link } from "react-router-dom";
import { useBLO } from "./BLOContext";
import NavBar from "./NavBar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { bloList, activities } = useBLO();

  // Calculate total BDA reports
  const totalReports = bloList.reduce((sum, blo) => sum + (blo.feedback?.length || 0), 0);

  // Calculate voter lists completed
  const bloWithReports = bloList.filter(blo => blo.feedback?.length > 0).length;
  const totalBLOs = bloList.length;

  // Calculate party supporters
  const partySupport = {};
  bloList.forEach(blo => {
    blo.feedback?.forEach(fb => {
      if (!partySupport[fb.party]) {
        partySupport[fb.party] = 0;
      }
      partySupport[fb.party] += parseInt(fb.supporters || 0);
    });
  });

  // Calculate BLO performance
  const bloPerformance = bloList.map(blo => ({
    name: blo.name,
    reports: blo.feedback?.length || 0,
    region: blo.region || 'Unassigned'
  })).filter(blo => blo.reports > 0);

  // Get max values for chart scaling
  const maxPartySupport = Math.max(...Object.values(partySupport), 1);
  const maxBloReports = Math.max(...bloPerformance.map(b => b.reports), 1);

  // Get recent activities (last 5)
  const latestActivities = activities.slice(-5).reverse();

  return (
    <div className="admin-dashboard">
      {/* shared navbar component */}
      <NavBar />

      <main className="dashboard-content">
        <h2 className="page-title">Admin Dashboard</h2>

        {/* quick stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <h4>Total BDA Reports</h4>
            <p>{totalReports}</p>
          </div>
          <div className="stat-card">
            <h4>Voter Lists Completed</h4>
            <p>{bloWithReports}/{totalBLOs}</p>
          </div>
          <div className="stat-card">
            <h4>Recent Activities</h4>
            {latestActivities.length > 0 ? (
              <ul>
                {latestActivities.map((activity, idx) => (
                  <li key={idx}>
                    {activity.type === 'create' && `Created BLO ${activity.blo}`}
                    {activity.type === 'assign' && `Assigned ${activity.region} region to ${activity.blo}`}
                    {activity.type === 'report' && `BLO ${activity.blo} submitted report for ${activity.party}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent activities</p>
            )}
          </div>
        </section>

        {/* graphical representations */}
        {Object.keys(partySupport).length > 0 && (
          <section className="chart-section">
            <h3 className="section-title">Party Support Chart</h3>
            <div className="bar-chart">
              {Object.entries(partySupport).map(([party, supporters]) => (
                <div key={party} className="bar-item">
                  <div className="bar-label">{party}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(supporters / maxPartySupport) * 100}%` }}
                    >
                      <span className="bar-value">{supporters}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {bloPerformance.length > 0 && (
          <section className="chart-section">
            <h3 className="section-title">BLO Performance</h3>
            <div className="bar-chart">
              {bloPerformance.map((blo) => (
                <div key={blo.name} className="bar-item">
                  <div className="bar-label">{blo.name} ({blo.region})</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill blo-bar" 
                      style={{ width: `${(blo.reports / maxBloReports) * 100}%` }}
                    >
                      <span className="bar-value">{blo.reports} reports</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;