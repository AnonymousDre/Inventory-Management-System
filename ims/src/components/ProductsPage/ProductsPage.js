import { useMemo, useState } from "react";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const products = useMemo(
    () => [
      {
        id: "nuke-001",
        name: "Strategic Warhead Mk IV",
        category: "nuclear",
        price: 12500000,
        stock: 2,
        sku: "SWMK4-NUC",
        status: "restricted",
        image: "☢️",
      },
      {
        id: "nuke-002",
        name: "Tactical Nuclear Device",
        category: "nuclear",
        price: 4200000,
        stock: 5,
        sku: "TND-021",
        status: "restricted",
        image: "☢️",
      },
      {
        id: "ammo-556",
        name: "5.56×45mm NATO (1,000 rds)",
        category: "ammo",
        price: 780,
        stock: 180,
        sku: "AM-556-1K",
        status: "active",
        image: "🔰",
      },
      {
        id: "ammo-762",
        name: "7.62×51mm NATO (1,000 rds)",
        category: "ammo",
        price: 1190,
        stock: 95,
        sku: "AM-762-1K",
        status: "active",
        image: "🔰",
      },
      {
        id: "gun-m4",
        name: "M4 Carbine",
        category: "firearm",
        price: 1450,
        stock: 42,
        sku: "FG-M4",
        status: "active",
        image: "🔫",
      },
      {
        id: "gun-m9",
        name: "M9 Service Pistol",
        category: "firearm",
        price: 620,
        stock: 120,
        sku: "FG-M9",
        status: "active",
        image: "🔫",
      },
      {
        id: "gear-nvg",
        name: "Gen-3 Night Vision Goggles",
        category: "gear",
        price: 3200,
        stock: 34,
        sku: "GE-NVG3",
        status: "active",
        image: "🎯",
      },
      {
        id: "gear-plate",
        name: "Ballistic Plate Carrier (Level IV)",
        category: "gear",
        price: 540,
        stock: 60,
        sku: "GE-PLT4",
        status: "active",
        image: "🛡️",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = `${p.name} ${p.sku}`
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
      amount
    );

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
          <button className="add-button">
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </header>

      <main className="products-sections">
        {categoriesInOrder.map((cat) => {
          const items = filtered.filter((p) => p.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="category-section">
              <h2 className="category-title">{cat.title}</h2>
              <div className="products-grid">
                {items.map((p) => (
                  <div key={p.id} className={`product-card ${p.status}`}>
                    <div className="product-badge">{p.image}</div>
                    <div className="product-body">
                      <div className="product-header">
                        <h3 className="product-name">{p.name}</h3>
                        <span className={`category-tag ${p.category}`}>{p.category}</span>
                      </div>
                      <div className="product-meta">
                        <span className="sku">SKU: {p.sku}</span>
                        <span className={`stock ${p.stock <= 5 ? "low" : "ok"}`}>
                          {p.stock <= 5 ? "LOW STOCK" : `${p.stock} in stock`}
                        </span>
                      </div>
                      <div className="product-footer">
                        <span className="price">{formatCurrency(p.price)}</span>
                        <div className="actions">
                          <button className="edit">EDIT</button>
                          <button className="restock">RESTOCK</button>
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
    </div>
  );
}