import { useEffect, useMemo, useState } from "react";
import "./ProductsPage.css";
import { supabase } from "../../supabaseClient";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "gear",
    price: "",
    stock: "",
    image: "",
    status: "active",
  });

  const fetchProducts = async () => {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      setErr(error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // Realtime subscribe to any products change
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return (products || []).filter((p) => {
      const matchesQuery = `${p.name ?? ""} ${p.sku ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = filter === "all" ? true : p.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [products, query, filter]);

  const categoriesInOrder = [
    { id: "nuclear", title: "NUCLEAR ORDNANCE" },
    { id: "firearm", title: "FIREARMS" },
    { id: "ammo", title: "AMMUNITION" },
    { id: "gear", title: "TACTICAL GEAR" },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      amount ?? 0
    );

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => {
    setIsAddOpen(false);
    setSaving(false);
    setForm({ name: "", sku: "", category: "gear", price: "", stock: "", image: "", status: "active" });
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const price = Number(form.price || 0);
    const stock = parseInt(form.stock || "0", 10);
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price,
      stock,
      status: form.status || "active",
      image: form.image || null,
    };
    const { error } = await supabase.from("products").insert([payload]);
    if (error) {
      alert(`Add failed: ${error.message}`);
      setSaving(false);
      return;
    }
    closeAdd();
    fetchProducts();
  };

  const handleRestock = async (product) => {
    const incStr = prompt("Increase stock by:", "1");
    const inc = parseInt(incStr || "0", 10);
    if (!Number.isFinite(inc) || inc <= 0) return;

    const { error } = await supabase
      .from("products")
      .update({ stock: (product.stock || 0) + inc })
      .eq("id", product.id);

    if (error) {
      alert(`Restock failed: ${error.message}`);
    } else {
      fetchProducts();
    }
  };

  return (
    <div className="military-products-container">
      <div className="dashboard-camouflage"></div>

      <header className="products-header">
        <h1 className="products-title">ARMORY CATALOG</h1>
        <div className="controls-row">
          <input
            className="search-input"
            placeholder="Scan inventory... (name or SKU)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="nuclear">Nuclear</option>
            <option value="firearm">Firearms</option>
            <option value="ammo">Ammo</option>
            <option value="gear">Gear</option>
          </select>
          <button className="add-button" onClick={openAdd}>
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </header>

      {isAddOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#0f172a", color: "#e2e8f0", padding: 20, borderRadius: 12, width: "min(520px, 92vw)", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Add Product</h3>
              <button onClick={closeAdd} style={{ background: "transparent", color: "#94a3b8", border: 0, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={submitAdd}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span>Name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., M4 Carbine" style={{ padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span>SKU</span>
                  <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g., FG-M4" style={{ padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span>Category</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" }}>
                    <option value="nuclear">nuclear</option>
                    <option value="firearm">firearm</option>
                    <option value="ammo">ammo</option>
                    <option value="gear">gear</option>
                  </select>
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span>Price</span>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g., 1450" style={{ padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span>Stock</span>
                  <input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="e.g., 10" style={{ padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span>Image URL or Emoji</span>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://... or 🔫" style={{ padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0b1220", color: "#e2e8f0" }} />
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <button type="button" onClick={closeAdd} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#cbd5e1", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: saving ? "#475569" : "#22c55e", color: "#0b1220", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {err && (
        <div style={{ color: "salmon", padding: "8px 16px" }}>
          Error: {err}
        </div>
      )}
      {loading && (
        <div style={{ padding: "8px 16px" }}>
          Loading products...
        </div>
      )}

      {!loading && (
        <main className="products-sections">
          {categoriesInOrder.map((cat) => {
            const items = filtered.filter((p) => p.category === cat.id);
            if (items.length === 0) return null;
            return (
              <section key={cat.id} className="category-section">
                <h2 className="category-title">{cat.title}</h2>
                <div className="products-grid">
                  {items.map((p) => (
                    <div key={p.id} className={`product-card ${p.status || "active"}`}>
                      <div className="product-badge">
                        {typeof p.image === "string" && /^https?:\/\//i.test(p.image) ? (
                          <img src={p.image} alt={p.name} style={{ width: 110, height: 110, objectFit: "contain", borderRadius: 8 }} />
                        ) : (
                          p.image || "🧰"
                        )}
                      </div>
                      <div className="product-body">
                        <div className="product-header">
                          <h3 className="product-name">{p.name}</h3>
                          <span className={`category-tag ${p.category}`}>{p.category}</span>
                        </div>
                        <div className="product-meta">
                          <span className="sku">SKU: {p.sku}</span>
                          <span className={`stock ${(p.stock || 0) <= 5 ? "low" : "ok"}`}>
                            {(p.stock || 0) <= 5 ? "LOW STOCK" : `${p.stock} in stock`}
                          </span>
                        </div>
                        <div className="product-footer">
                          <span className="price">{formatCurrency(p.price)}</span>
                          <div className="actions">
                            <button className="edit" onClick={() => alert("TODO: edit dialog")}>EDIT</button>
                            <button className="restock" onClick={() => handleRestock(p)}>RESTOCK</button>
                          </div>
                        </div>
                      </div>
                      {p.status === "restricted" && (
                        <div className="restricted-banner">RESTRICTED</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      )}
    </div>
  );
}