import { useMemo, useState } from "react";
import "./CustomerPage.css";

// --- Mock Data ---
const customersData = [
  {
    id: "CUST-001",
    name: "Blackwood PMC",
    contactPerson: "Gen. Aleksandr Voron",
    email: "procurement@blackwood-pmc.com",
    phone: "+1-202-555-0173",
    registrationDate: "2023-05-20",
    totalOrders: 8,
    totalSpent: 4215000,
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "Aegis Security",
    contactPerson: "Maria Thorne",
    email: "m.thorne@aegis-sec.net",
    phone: "+44-20-7946-0958",
    registrationDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 3160,
    status: "Active",
  },
  {
    id: "CUST-003",
    name: "Gen-IV Dynamics",
    contactPerson: "Dr. Aris Thorne",
    email: "aris.t@gen-iv.tech",
    phone: "+81-3-4567-8901",
    registrationDate: "2024-08-01",
    totalOrders: 1,
    totalSpent: 4203200,
    status: "On Watchlist",
  },
  {
    id: "CUST-004",
    name: "Red Sector Group",
    contactPerson: "Unknown",
    email: "contact@redsector.inf",
    phone: "CLASSIFIED",
    registrationDate: "2022-11-30",
    totalOrders: 3,
    totalSpent: 12800,
    status: "Restricted",
  },
];

// --- Helper Functions ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = useMemo(() => {
    return customersData.filter((customer) => {
      const matchesQuery = `${customer.id} ${customer.name} ${customer.contactPerson}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = statusFilter === "all" ? true : customer.status.toLowerCase() === statusFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, statusFilter]);

  return (
    <div className="military-customers-container">
      <div className="dashboard-camouflage"></div>

      <header className="customers-header">
        <h1 className="customers-title">CLIENT ROSTER</h1>
        <div className="controls-row">
          <input
            className="search-input"
            placeholder="Search Name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on-watchlist">On Watchlist</option>
            <option value="restricted">Restricted</option>
          </select>
        </div>
      </header>

      <main className="customers-content">
        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className={`customer-card ${customer.status.toLowerCase()}`}>
              <div className="card-header">
                <h3 className="customer-name">{customer.name}</h3>
                <span className={`status-tag ${customer.status.toLowerCase()}`}>
                  {customer.status}
                </span>
              </div>
              <div className="customer-details">
                <p><strong>ID:</strong> {customer.id}</p>
                <p><strong>Contact:</strong> {customer.contactPerson}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
              </div>
              <div className="customer-stats">
                <div className="stat-item">
                  <span>Total Orders</span>
                  <strong>{customer.totalOrders}</strong>
                </div>
                <div className="stat-item">
                  <span>Total Spent</span>
                  <strong>{formatCurrency(customer.totalSpent)}</strong>
                </div>
                <div className="stat-item">
                  <span>Client Since</span>
                  <strong>{formatDate(customer.registrationDate)}</strong>
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn view-profile">VIEW PROFILE</button>
                <button className="action-btn order-history">ORDER HISTORY</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}