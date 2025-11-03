

import React, { useState, useEffect } from "react";
import OverviewCharts from "../components/FinanceTable/OverviewCharts";
import RecentTransactions from "../components/FinanceTable/RecentTransactions";
import RevenueTable from "../components/FinanceTable/RevenueTable";
import ExpenseTable from "../components/FinanceTable/ExpenseTable";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartDataLabels
);

const Finance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("Last Month");

  // ✅ States
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [netLoss, setNetLoss] = useState(0);
  const [revenue, setRevenue] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [months, setMonths] = useState([]);

  // ✅ Fetch summary
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/finance-summary")
      .then((res) => {
        if (res.data) {
          setTotalRevenue(res.data.totalRevenue || 0);
          setTotalExpenses(res.data.totalExpenses || 0);
          setNetProfit(res.data.netProfit || 0);
          setNetLoss(res.data.netLoss || 0);
        }
      })
      .catch(() => console.log("Backend not ready, using defaults"));
  }, []);

  // ✅ Fetch Revenue & Expenses Totals for Cards (runs once on page load)
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/revenue")
      .then((res) => {
        if (res.data?.values) {
          const sumRevenue = res.data.values.reduce((acc, val) => acc + val, 0);
          setTotalRevenue(sumRevenue);
        }
      })
      .catch(() => console.log("Backend not ready for revenue"));

    axios
      .get("http://localhost:4000/api/expenses")
      .then((res) => {
        if (res.data?.values) {
          const sumExpenses = res.data.values.reduce((acc, val) => acc + val, 0);
          setTotalExpenses(sumExpenses);
        }
      })
      .catch(() => console.log("Backend not ready for expenses"));
  }, []);

  // ✅ Auto-calc Net Profit / Loss
  useEffect(() => {
    const profit = totalRevenue - totalExpenses;
    setNetProfit(profit > 0 ? profit : 0);
    setNetLoss(totalExpenses > totalRevenue ? totalExpenses - totalRevenue : 0);
  }, [totalRevenue, totalExpenses]);

  // ✅ Fetch revenue for chart (only when revenue tab is active)
  useEffect(() => {
    if (activeTab === "revenue") {
      axios
        .get("http://localhost:4000/api/revenue")
        .then((res) => {
          if (res.data?.values && res.data?.months) {
            setRevenue(res.data.values);
            setMonths(res.data.months);
          }
        })
        .catch(() => console.log("Backend not ready for revenue"));
    }
  }, [activeTab]);

  // ✅ Fetch expenses for chart (only when expenses tab is active)
  useEffect(() => {
    if (activeTab === "expenses") {
      axios
        .get("http://localhost:4000/api/expenses")
        .then((res) => {
          if (res.data?.values && res.data?.months) {
            setExpenses(res.data.values);
            setMonths(res.data.months);
          }
        })
        .catch(() => console.log("Backend not ready for expenses"));
    }
  }, [activeTab]);

  // ✅ Chart configs (Revenue)
  const revenueData = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        fill: true,
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        borderColor: "green",
        pointBackgroundColor: "green",
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        align: "top",
        color: "black",
        font: { weight: "bold" },
        formatter: (value) => `₹${value.toLocaleString()}`,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue: ₹${ctx.raw.toLocaleString()}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `₹${val / 1000}k`,
        },
      },
    },
  };

  // ✅ Chart configs (Expenses)
  const expensesData = {
    labels: months,
    datasets: [
      {
        label: "Expenses",
        data: expenses,
        fill: true,
        backgroundColor: "rgba(255, 99, 133, 0.16)",
        borderColor: "red",
        pointBackgroundColor: "red",
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const expensesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        align: "top",
        color: "black",
        font: { weight: "bold" },
        formatter: (value) => `₹${value.toLocaleString()}`,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Expenses: ₹${ctx.raw.toLocaleString()}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `₹${val / 1000}k`,
        },
      },
    },
  };

  return (
    <div className="container-fluid mt-4">
      {/* === Header === */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div className="mb-2">
          <h4 className="fw-bold">Finance Overview</h4>
          <p className="text-muted mb-0">Track revenue, expenses, and profitability</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {timeRange}
            </button>
            <ul className="dropdown-menu">
              {["Last Month", "Last 3 Months", "Last 6 Months", "Last Year"].map((range) => (
                <li key={range}>
                  <button className="dropdown-item" onClick={() => setTimeRange(range)}>
                    {range}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-outline-secondary">Export</button>
        </div>
      </div>


      {/* === Summary Cards === */}
      <div className="row g-3 mb-4">
        {/* Total Revenue */}
        <div className="col-12 col-md-3">
          <div className="card p-3 shadow-sm h-100">
            <h6>Total Revenue</h6>
            <h4 className="fw-bold text-dark">₹{totalRevenue.toLocaleString()}</h4>
            <small className="text-success">
              ▲ Based on database values
            </small>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="col-12 col-md-3">
          <div className="card p-3 shadow-sm h-100">
            <h6>Total Expenses</h6>
            <h4 className="fw-bold text-dark">₹{totalExpenses.toLocaleString()}</h4>
            <small className="text-danger">
              ▼ Based on database values
            </small>
          </div>
        </div>

        {/* Net Profit */}
        <div className="col-12 col-md-3">
          <div className="card p-3 shadow-sm h-100">
            <h6>Net Profit</h6>
            <h4 className="fw-bold text-success">₹{netProfit.toLocaleString()}</h4>
            <small className="text-success">
              ▲ Auto calculated
            </small>
          </div>
        </div>

        {/* Net Loss */}
        <div className="col-12 col-md-3">
          <div className="card p-3 shadow-sm h-100">
            <h6>Net Loss</h6>
            <h4 className="fw-bold text-danger">₹{netLoss.toLocaleString()}</h4>
            <small className="text-danger">
              ▼ Auto calculated
            </small>
          </div>
        </div>
      </div>



      {/* === Tabs === */}
      <ul className="nav nav-pills mb-4 flex-wrap">
        {["overview", "revenue", "expenses"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* === Charts === */}
      <div className="card p-3 shadow-sm mb-4">
        {activeTab === "overview" && <OverviewCharts />}
        {activeTab === "revenue" && (
          <RevenueTable
            revenueData={revenueData}
            revenueOptions={revenueOptions}
          />
        )}
        {activeTab === "expenses" && (
          <ExpenseTable
            expensesData={expensesData}
            expensesOptions={expensesOptions}
          />
        )}
      </div>

      {/* === Transactions Table === */}
      <RecentTransactions />
    </div>
  );
};

export default Finance;
