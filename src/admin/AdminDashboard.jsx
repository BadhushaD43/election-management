// AdminDashboard.jsx
import { Link } from "react-router-dom";
import { useBLO } from "./BLOContext";
import NavBar from "./NavBar";
import "./AdminDashboard.css";
import { useEffect, useRef } from "react";

const getPartyColor = (index) => {
  const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997'];
  return colors[index % colors.length];
};

const drawBarChart = (canvas, data) => {
  const ctx = canvas.getContext('2d');
  const entries = data;
  const maxValue = Math.max(...entries.map(e => e.reports), 1);
  
  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  const barWidth = 50;
  const barSpacing = 40;
  const totalBarsWidth = entries.length * barWidth + (entries.length - 1) * barSpacing;
  const startX = (canvas.width - totalBarsWidth) / 2;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw axes
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw bars
  entries.forEach((blo, idx) => {
    const barHeight = (blo.reports / maxValue) * chartHeight;
    const x = startX + idx * (barWidth + barSpacing);
    const y = canvas.height - padding - barHeight;
    
    ctx.fillStyle = '#007bff';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw value on top
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(blo.reports, x + barWidth / 2, y - 5);
  });
};

const drawPieChart = (canvas, data) => {
  const ctx = canvas.getContext('2d');
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, val]) => sum + val, 0);
  
  const size = Math.min(canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = size / 2 - 20;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let currentAngle = -Math.PI / 2;
  
  entries.forEach(([party, supporters], idx) => {
    const sliceAngle = (supporters / total) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = getPartyColor(idx);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    currentAngle += sliceAngle;
  });
};

function AdminDashboard() {
  const { bloList, activities } = useBLO();
  const pieCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);

  // Calculate total BDA reports
  const totalReports = bloList.reduce((sum, blo) => sum + (blo.feedback?.length || 0), 0);

  // Calculate voter lists completed
  const bloWithReports = bloList.filter(blo => blo.feedback?.length > 0).length;
  const totalBLOs = bloList.length;
  
  // Calculate average reports per BDA
  const avgReports = totalBLOs > 0 ? (totalReports / totalBLOs).toFixed(1) : 0;

  // Get last report time
  const lastReportActivity = activities.filter(a => a.type === 'report').slice(-1)[0];
  const lastReportTime = lastReportActivity ? 'Just now' : 'No reports yet';

  // Calculate completion percentage
  const completionPercentage = totalBLOs > 0 ? ((bloWithReports / totalBLOs) * 100).toFixed(0) : 0;

  // Regional breakdown
  const regionBreakdown = {};
  bloList.forEach(blo => {
    const region = blo.region || 'Unassigned';
    if (!regionBreakdown[region]) {
      regionBreakdown[region] = { total: 0, completed: 0 };
    }
    regionBreakdown[region].total++;
    if (blo.feedback?.length > 0) {
      regionBreakdown[region].completed++;
    }
  });

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

  useEffect(() => {
    if (pieCanvasRef.current && Object.keys(partySupport).length > 0) {
      const canvas = pieCanvasRef.current;
      const container = canvas.parentElement;
      const size = Math.min(container.offsetWidth, 400);
      canvas.width = size;
      canvas.height = size;
      drawPieChart(canvas, partySupport);
      
      const handleResize = () => {
        const newSize = Math.min(container.offsetWidth, 400);
        canvas.width = newSize;
        canvas.height = newSize;
        drawPieChart(canvas, partySupport);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [partySupport]);

  useEffect(() => {
    if (barCanvasRef.current && bloPerformance.length > 0) {
      const canvas = barCanvasRef.current;
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = 300;
      drawBarChart(canvas, bloPerformance);
      
      const handleResize = () => {
        canvas.width = container.offsetWidth;
        canvas.height = 300;
        drawBarChart(canvas, bloPerformance);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [bloPerformance]);

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
            <div className="stat-meta">
              <span>Avg: {avgReports} per BDA</span>
              <span className="stat-time">Last: {lastReportTime}</span>
            </div>
          </div>
          <div className="stat-card">
            <h4>Voter Lists Completed</h4>
            <p>{bloWithReports}/{totalBLOs}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <span className="stat-percentage">{completionPercentage}% Complete</span>
            <div className="region-breakdown">
              {Object.entries(regionBreakdown).map(([region, data]) => (
                <div key={region} className="region-item">
                  <span className="region-name">{region}:</span>
                  <span className="region-value">{data.completed}/{data.total}</span>
                </div>
              ))}
            </div>
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
            <div className="pie-chart-container">
              <canvas ref={pieCanvasRef} className="pie-canvas"></canvas>
              <div className="pie-legend">
                {Object.entries(partySupport).map(([party, supporters], idx) => (
                  <div key={party} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: getPartyColor(idx) }}></span>
                    <span className="legend-text">{party}: {supporters}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {bloPerformance.length > 0 && (
          <section className="chart-section">
            <h3 className="section-title">BLO Performance</h3>
            <div className="bar-chart-container">
              <canvas ref={barCanvasRef} className="bar-canvas"></canvas>
              <div className="bar-legend">
                {bloPerformance.map((blo, idx) => (
                  <div key={blo.name} className="legend-item">
                    <span className="legend-text">{blo.name} ({blo.region})</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;