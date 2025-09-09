import { useMemo, useState } from "react";
import "./OrdersPage.css";

// --- Helper Functions ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

// --- Mock Data ---
const ordersData = [
  {
    orderId: "ORD-7B3C1A",
    customer: "Blackwood PMC",
    date: "2025-09-08T14:30:00Z",
    total: 1450,
    status: "Shipped",
    itemCount: 1,
  },
  {
    orderId: "ORD-9F2D5E",
    customer: "Aegis Security",
    date: "2025-09-07T10:15:00Z",
    total: 2380,
    status: "Delivered",
    itemCount: 2,
  },
    {
    orderId: "ORD-1A8G9H",
    customer: "Gen-IV Dynamics",
    date: "2025-09-09T11:00:00Z",
    total: 4203200,
    status: "Processing",
    itemCount: 2,
  },
  {
    orderId: "ORD-5K4M2N",
    customer: "Red Sector Group",
    date: "2025-09-05T18:45:00Z",
    total: 540,
    status: "Cancelled",
    itemCount: 1,
  },
  {
    orderId: "ORD-3J1P7Q",
    customer: "Aegis Security",
    date: "2025-09-08T09:00:00Z",
    total: 780,
    status: "Delivered",
    itemCount: 1,
  },
];

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesQuery = `${order.orderId} ${order.customer}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = statusFilter === "all" ? true : order.status.toLowerCase() === statusFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, statusFilter]);

  return (
    <div className="military-orders-container">
      <div className="dashboard-camouflage"></div>

      <header className="orders-header">
        <h1 className="orders-title">ORDER MANIFEST</h1>
        <div className="controls-row">
          <input
            className="search-input"
            placeholder="Search ID or Customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </header>

      <main className="orders-content">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.customer}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.itemCount}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <div className="actions">
                      <button className="details-btn">VIEW DETAILS</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}