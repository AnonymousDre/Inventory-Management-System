import { useState, useEffect } from "react";
import "./DashBoardPage.css";

export default function DashBoardPage({ onLogout }) {
  const [user] = useState({ name: "Commander" });
  const [metrics, setMetrics] = useState({
    totalSales: 125430,
    totalVolume: 2847,
    totalRevenue: 892340,
    activeOrders: 156,
    inventoryItems: 3421,
    lowStockItems: 23
  });

  const [revenueData] = useState([
    { month: "Jan", revenue: 65000 },
    { month: "Feb", revenue: 72000 },
    { month: "Mar", revenue: 68000 },
    { month: "Apr", revenue: 75000 },
    { month: "May", revenue: 82000 },
    { month: "Jun", revenue: 89000 }
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalSales: prev.totalSales + Math.floor(Math.random() * 100),
        activeOrders: prev.activeOrders + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="military-dashboard-container">
      <div className="dashboard-camouflage"></div>
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="dashboard-logo">THIS IS AMERICA</h1>
            <span className="system-status">SYSTEMS ONLINE</span>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="welcome-text">WELCOME BACK,</span>
              <span className="user-name">{user.name.toUpperCase()}</span>
            </div>
            <button className="logout-button" onClick={onLogout}>
              <span className="button-text">STAND DOWN</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          
          {/* Mission Briefing Section */}
          <section className="mission-briefing">
            <h2 className="section-title">MISSION BRIEFING</h2>
            <div className="briefing-content">
              <p className="briefing-text">
                Current operational status: All systems functioning within normal parameters. 
                Inventory levels maintained, orders processing efficiently.
              </p>
            </div>
          </section>

          {/* Key Metrics Grid */}
          <section className="metrics-section">
            <h2 className="section-title">OPERATIONAL METRICS</h2>
            <div className="metrics-grid">
              
              {/* Total Revenue Card */}
              <div className="metric-card primary">
                <div className="card-header">
                  <h3 className="card-title">TOTAL REVENUE</h3>
                  <div className="card-icon">💰</div>
                </div>
                <div className="card-content">
                  <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
                  <div className="metric-change positive">+12.5% from last month</div>
                </div>
              </div>

              {/* Total Sales Card */}
              <div className="metric-card">
                <div className="card-header">
                  <h3 className="card-title">TOTAL SALES</h3>
                  <div className="card-icon">📊</div>
                </div>
                <div className="card-content">
                  <div className="metric-value">{formatNumber(metrics.totalSales)}</div>
                  <div className="metric-change positive">+8.3% from last month</div>
                </div>
              </div>

              {/* Total Volume Card */}
              <div className="metric-card">
                <div className="card-header">
                  <h3 className="card-title">TOTAL VOLUME</h3>
                  <div className="card-icon">📦</div>
                </div>
                <div className="card-content">
                  <div className="metric-value">{formatNumber(metrics.totalVolume)}</div>
                  <div className="metric-change positive">+15.2% from last month</div>
                </div>
              </div>

              {/* Active Orders Card */}
              <div className="metric-card">
                <div className="card-header">
                  <h3 className="card-title">ACTIVE ORDERS</h3>
                  <div className="card-icon">⚡</div>
                </div>
                <div className="card-content">
                  <div className="metric-value">{metrics.activeOrders}</div>
                  <div className="metric-change neutral">Processing</div>
                </div>
              </div>

              {/* Inventory Items Card */}
              <div className="metric-card">
                <div className="card-header">
                  <h3 className="card-title">INVENTORY ITEMS</h3>
                  <div className="card-icon">📋</div>
                </div>
                <div className="card-content">
                  <div className="metric-value">{formatNumber(metrics.inventoryItems)}</div>
                  <div className="metric-change positive">+2.1% from last month</div>
                </div>
              </div>

              {/* Low Stock Alert Card */}
              <div className="metric-card alert">
                <div className="card-header">
                  <h3 className="card-title">LOW STOCK ALERT</h3>
                  <div className="card-icon">⚠️</div>
                </div>
                <div className="card-content">
                  <div className="metric-value">{metrics.lowStockItems}</div>
                  <div className="metric-change negative">Items need restocking</div>
                </div>
              </div>

            </div>
          </section>

          {/* Revenue Chart Section */}
          <section className="chart-section">
            <h2 className="section-title">REVENUE ANALYSIS</h2>
            <div className="chart-container">
              <div className="chart-header">
                <h3 className="chart-title">MONTHLY REVENUE TREND</h3>
                <div className="chart-period">Last 6 Months</div>
              </div>
              <div className="revenue-chart">
                <div className="chart-bars">
                  {revenueData.map((data, index) => (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className="chart-bar"
                        style={{ 
                          height: `${(data.revenue / 100000) * 100}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                      <div className="bar-value">{formatCurrency(data.revenue)}</div>
                      <div className="bar-label">{data.month}</div>
                    </div>
                  ))}
                </div>
                <div className="chart-axis">
                  <div className="y-axis">
                    <span>100K</span>
                    <span>75K</span>
                    <span>50K</span>
                    <span>25K</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </section>


        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>CLASSIFIED INVENTORY MANAGEMENT SYSTEM - AUTHORIZED PERSONNEL ONLY</p>
          <div className="system-info">
            <span>Status: OPERATIONAL</span>
            <span>Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}