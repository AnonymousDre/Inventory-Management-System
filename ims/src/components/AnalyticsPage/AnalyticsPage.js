import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./AnalyticsPage.css";

// --- Mock Data ---
const salesData = [
  { month: "Mar", revenue: 120500 },
  { month: "Apr", revenue: 180200 },
  { month: "May", revenue: 150700 },
  { month: "Jun", revenue: 210000 },
  { month: "Jul", revenue: 250400 },
  { month: "Aug", revenue: 310900 },
];

const topProductsData = [
  { name: "5.56 NATO", unitsSold: 980 },
  { name: "M9 Pistol", unitsSold: 850 },
  { name: "7.62 NATO", unitsSold: 720 },
  { name: "Plate Carrier", unitsSold: 650 },
  { name: "M4 Carbine", unitsSold: 580 },
];

const categoryData = [
  { category: "Ammo", sales: 4500, fullMark: 5000 },
  { category: "Firearms", sales: 3800, fullMark: 5000 },
  { category: "Gear", sales: 3200, fullMark: 5000 },
  { category: "Nuclear", sales: 1500, fullMark: 5000 },
];

const kpiData = {
  totalRevenue: 4850290,
  avgOrderValue: 21848,
  newCustomers: 14,
  ordersThisMonth: 88,
};

// --- Helper Functions ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(amount);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="intro">{`${payload[0].name} : ${
          payload[0].dataKey === "revenue"
            ? formatCurrency(payload[0].value)
            : payload[0].value
        }`}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("90");

  return (
    <div className="military-analytics-container">
      <div className="dashboard-camouflage"></div>

      <header className="analytics-header">
        <h1 className="analytics-title">SITUATION REPORT</h1>
        <div className="controls-row">
          <select
            className="filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last 365 Days</option>
          </select>
        </div>
      </header>

      <main className="analytics-content">
        {/* KPI Section */}
        <div className="kpi-grid">
          <div className="kpi-item">
            <span>Total Revenue</span>
            <strong>{formatCurrency(kpiData.totalRevenue)}</strong>
          </div>
          <div className="kpi-item">
            <span>Avg. Order Value</span>
            <strong>{formatCurrency(kpiData.avgOrderValue)}</strong>
          </div>
          <div className="kpi-item">
            <span>New Clients</span>
            <strong>{kpiData.newCustomers}</strong>
          </div>
          <div className="kpi-item">
            <span>Monthly Orders</span>
            <strong>{kpiData.ordersThisMonth}</strong>
          </div>
        </div>

        {/* Charts Section */}
        <div className="analytics-grid">
          <div className="widget-container">
            <h3 className="widget-title">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid stroke="rgba(255, 215, 0, 0.2)" />
                <XAxis dataKey="month" stroke="#ffd700" />
                <YAxis stroke="#ffd700" tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#00ff9d" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="widget-container">
            <h3 className="widget-title">Top Products (Units Sold)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid stroke="rgba(255, 215, 0, 0.2)" />
                <XAxis type="number" stroke="#ffd700" />
                <YAxis type="category" dataKey="name" stroke="#ffd700" width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 215, 0, 0.1)' }} />
                <Bar dataKey="unitsSold" name="Units Sold" fill="#ffd700" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="widget-container full-width">
            <h3 className="widget-title">Sales Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart outerRadius="80%" data={categoryData}>
                    <PolarGrid stroke="rgba(255, 215, 0, 0.4)"/>
                    <PolarAngleAxis dataKey="category" stroke="#fff" />
                    <PolarRadiusAxis angle={30} domain={[0, 5000]} stroke="rgba(255, 255, 255, 0.5)" />
                    <Radar name="Sales" dataKey="sales" stroke="#ffc107" fill="#ffc107" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}