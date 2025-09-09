import "./Sidebar.css";

export default function Sidebar({ currentPage, onNavigate }) {

  const menuItems = [
    {
      id: "dashboard",
      label: "COMMAND CENTER",
      icon: "🏠",
      description: "Mission Overview"
    },
    {
      id: "products",
      label: "INVENTORY",
      icon: "📦",
      description: "Manage Stock"
    },
    {
      id: "orders",
      label: "ORDERS",
      icon: "📋",
      description: "View Orders"
    },
    {
      id: "customers",
      label: "PERSONNEL",
      icon: "👥",
      description: "Customer Data"
    },
    {
      id: "analytics",
      label: "INTEL",
      icon: "📊",
      description: "Analytics"
    },
    {
      id: "settings",
      label: "CONFIG",
      icon: "⚙️",
      description: "Settings"
    }
  ];

  const handleItemClick = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <div className={`military-sidebar`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h2 className="logo-text">TIA</h2>
          <span className="logo-subtitle">COMMAND</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
                {currentPage === item.id && (
                  <div className="active-indicator"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator"></div>
          <span className="status-text">ONLINE</span>
        </div>
        <div className="footer-info">
          <p>CLASSIFIED SYSTEM</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
