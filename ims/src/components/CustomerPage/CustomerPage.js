import { useEffect, useMemo, useState } from "react";
import "./CustomerPage.css";
import { supabase } from "../../supabaseClient";

// Data will be fetched from Supabase

// --- Helper Functions ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("company", { ascending: true });
    if (error) {
      setErr(error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    const channel = supabase
      .channel("customers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        () => fetchCustomers()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customers = useMemo(() => {
    return (rows || []).map((r) => ({
      id: r.id,
      name: r.company || r.full_name || r.name || "",
      contactPerson: r.representative || r.contact_person || r.contactPerson || r.primary_contact || "",
      // email intentionally omitted from UI per request
      phone: r.phone || "",
      country: r.country || "",
      registrationDate: r.registrationDate || r.client_since || r.signup_date || null,
      totalOrders: r.total_orders ?? r.totalOrders ?? 0,
      totalSpent: r.total_spent ?? r.totalSpent ?? 0,
      status: (r.status || "Active").toString(),
    }));
  }, [rows]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesQuery = `${customer.id} ${customer.name} ${customer.contactPerson}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = statusFilter === "all" ? true : customer.status.toLowerCase() === statusFilter;
      return matchesQuery && matchesFilter;
    });
  }, [customers, query, statusFilter]);

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

      {err && (
        <div style={{ color: "salmon", padding: "8px 16px" }}>Error: {err}</div>
      )}
      {loading && (
        <div style={{ padding: "8px 16px" }}>Loading customers...</div>
      )}
      {!loading && (
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
                <p><strong>Phone:</strong> {customer.phone}</p>
                <p><strong>Country:</strong> {customer.country}</p>
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
      )}
    </div>
  );
}