import { useEffect, useMemo, useState } from "react";
import "./OrdersPage.css";
import { supabase } from "../../supabaseClient";

// --- Helper Functions ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

// --- Data from Supabase ---
// This page expects a table named `orders`.
// It supports common column names via normalization: id/order_id, customer/customer_name,
// created_at/date, total/amount_total, item_count/items_count, status.

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ordersRaw, setOrdersRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      setErr(error.message);
      setOrdersRaw([]);
    } else {
      setOrdersRaw(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // Realtime updates
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orders = useMemo(() => {
    return (ordersRaw || []).map((o) => {
      const orderId = o.id;
      const customer = o.customer_id; // render ID; join later if needed
      const date = o.date;
      const total = Number(o.total ?? 0);
      const status = (o.status || "processing").toString();
      const itemCount = Number(o.items_ordered ?? 0);
      return { orderId, customer, date, total, status, itemCount };
    });
  }, [ordersRaw]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery = `${order.orderId} ${order.customer}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = statusFilter === "all" ? true : order.status.toLowerCase() === statusFilter;
      return matchesQuery && matchesFilter;
    });
  }, [orders, query, statusFilter]);

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

      {err && (
        <div style={{ color: "salmon", padding: "8px 16px" }}>Error: {err}</div>
      )}
      {loading && (
        <div style={{ padding: "8px 16px" }}>Loading orders...</div>
      )}
      {!loading && (
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
      )}
    </div>
  );
}