import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AdminHeader from "../AdminHeader/AdminHeader";
import AdminSidebar from "../AdminHome/AdminSidebar";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {

  const [data, setData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    monthlySales: [],
    yearlySales: [],
  });

  const [filter, setFilter] = useState("month");

  useEffect(() => {
    axios
      .get("https://vlux-backend.onrender.com/api/vlux/admin/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const chartData =
    filter === "month"
      ? data.monthlySales || []
      : data.yearlySales || [];

  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"];

  const format = (v) => Math.round(v || 0);

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        fontSize={10}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {format(value)}
      </text>
    );
  };

  return (
    <>
      <AdminHeader />

      <div className={styles.container}>
        <AdminSidebar />

        <div className={styles.right}>

          <h2>Admin Dashboard</h2>

          {/* FILTER */}
          <div className={styles.filterBox}>
            <button className={styles.mbtn} onClick={() => setFilter("month")}>Monthly</button>
            <button className={styles.mbtn} onClick={() => setFilter("year")}>Yearly</button>
          </div>

          {/* CARDS */}
          <div className={styles.cardRow}>
            <div className={styles.card}>
              <h4>Total Orders</h4>
              <p>{format(data.totalOrders)}</p>
            </div>

            <div className={styles.card}>
              <h4>Total Users</h4>
              <p>{format(data.totalUsers)}</p>
            </div>

            <div className={styles.card}>
              <h4>Total Products</h4>
              <p>{format(data.totalProducts)}</p>
            </div>

            <div className={styles.card}>
              <h4>Total Revenue</h4>
              <p>₹{format(data.totalRevenue)}</p>
            </div>
          </div>

          {/* CHARTS */}
          <div className={styles.chartRow}>

            {/* LINE */}
            <div className={styles.chartBox}>
              <h4>Sales Trend</h4>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#4caf50"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* BAR */}
            <div className={styles.chartBox}>
              <h4>Orders Growth</h4>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <Bar
                    dataKey="sales"
                    fill="#2196f3"
                    radius={[4, 4, 0, 0]}
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE */}
            <div className={styles.chartBox}>
              <h4>Products Sold</h4>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.topProducts || []}
                    dataKey="totalQty"
                    nameKey="name"
                    outerRadius={80}
                    label={renderPieLabel}
                  >
                    {data.topProducts?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip formatter={(v, n) => [`${format(v)}`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* TABLES */}
          <div className={styles.tableRow}>

            {/* TOP PRODUCTS */}
            <div className={styles.tableBox}>
              <h4>Top Products</h4>

              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Product</th>
                      <th style={{ textAlign: "left" }}>Model</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.topProducts?.map((p, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: "left" }}>{p.name}</td>
                        <td style={{ textAlign: "left" }}>{p.modelNumber}</td>
                        <td>{format(p.totalQty)}</td>
                        <td>₹{format(p.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECENT ORDERS (WITH DATE ADDED) */}
            <div className={styles.tableBox}>
              <h4>Recent Orders</h4>

              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>User</th>
                      <th style={{ textAlign: "left" }}>Phone</th>
                      <th>Date</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recentOrders?.map((o, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: "left" }}>
                          {o.userId?.name || "N/A"}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {o.userId?.phoneNumber || "N/A"}
                        </td>
                        <td>{formatDate(o.createdAt)}</td>
                        <td>₹{format(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}