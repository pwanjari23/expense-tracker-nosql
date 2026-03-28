import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Trophy,
  Sparkles,
  Settings,
  LogOut,
  Plus,
  Search,
  ArrowUpRight,
  X,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReactMarkdown from "react-markdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food & Drink",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    amount: "",
    category: "",
  });
  const [leaderboard, setLeaderboard] = useState([]);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Expenses", icon: Receipt },
    { name: "Reports", icon: BarChart3 },
    { name: "AI Insights", icon: Sparkles },
    { name: "Leaderboard", icon: Trophy },
  ];
  const COLORS = ["#ef4444", "#f59e0b", "#00D54B", "#3b82f6"];

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // get logged-in user's token

    try {
      const res = await axios.post(
        "http://localhost:5000/api/expenses/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Expense Saved:", res.data);

      setIsModalOpen(false);
      setFormData({ title: "", amount: "", category: "Food & Drink" });
      fetchExpenses(); // refresh expenses
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense");
    }
  };

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token"); // get the logged-in user's token
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Expenses:", res.data);
      setExpenses(res.data); // now only logged-in user's expenses
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem("token"); // get logged-in user's token
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchExpenses();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete");
    }
  };

  const handleUpdateExpense = async (id, updatedData) => {
    const token = localStorage.getItem("token"); // get logged-in user's token
    try {
      await axios.put(`http://localhost:5000/api/expenses/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update");
    }
  };

  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaderboard(res.data); // now only relevant leaderboard data for logged-in user should come
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "Leaderboard") {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const totalSpending = expenses.reduce((acc, item) => {
    return acc + Number(item.amount || 0);
  }, 0);

  const DashboardHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#002111] p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <ArrowUpRight size={80} />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            Financial Strategy
          </p>
          <h3 className="text-3xl font-serif">50 • 30 • 20 Rule</h3>
          <div className="mt-4 flex items-center gap-2 text-[#00D54B] text-xs font-bold">
            <span className="bg-[#00D54B]/10 px-2 py-0.5 rounded-md">
              Needs • Wants • Save
            </span>
          </div>
        </div>

        <div className="bg-[#002111] p-6 rounded-3xl border border-white/5">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            Total Spending
          </p>
          <h3 className="text-3xl font-serif">
            ₹{totalSpending.toLocaleString("en-IN")}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold">
            <span className="bg-red-400/10 px-2 py-0.5 rounded-md">
              See where your money goes
            </span>
          </div>
        </div>

        <div className="bg-[#A8F2D0] p-6 rounded-3xl border border-transparent text-[#002111]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} fill="#002111" />
            <p className="text-[#002111]/60 text-xs font-bold uppercase tracking-widest">
              AI Insight
            </p>
          </div>
          <h3 className="text-lg font-bold leading-tight">
            "Let AI help you track and save on your monthly expenses."
          </h3>
          <button
            onClick={() => setActiveTab("AI Insights")}
            className="mt-4 text-xs font-black underline underline-offset-4 uppercase"
          >
            See How
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#002111] rounded-3xl border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Recent Expenses</h4>
            <button
              onClick={() => setActiveTab("Expenses")}
              className="text-[#00D54B] text-xs font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No recent expenses yet. Add some to see here!
              </p>
            ) : (
              [...expenses]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
                .slice(0, 3) // only 3 items
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#001A0E] rounded-full flex items-center justify-center text-[#00D54B] font-bold">
                        {item.title[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {item.category} •{" "}
                          {new Date(
                            item.createdAt || item.date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-gray-200">
                      - ₹{item.amount}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="bg-[#002111] rounded-3xl border border-white/5 p-6 shadow-xl">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-emerald-400">
            <Sparkles size={18} className="text-yellow-500" /> Smart Budgeting
          </h4>

          <div className="space-y-5">
            {[
              "A penny saved is a penny earned",
              "Don't save what is left after spending",
              "Beware of little expenses; a small leak sinks a ship",
              "Money grows on the tree of patience",
            ].map((tip, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 transition-all hover:translate-x-1"
              >
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-xs leading-relaxed font-medium text-gray-300 group-hover:text-white">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">
                Daily Goal
              </p>
              <p className="text-sm font-semibold text-emerald-400 underline underline-offset-4 decoration-emerald-500/30">
                Stay under ₹1,200 today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ExpensesView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    const currentExpenses = expenses
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
      <div className="bg-[#002111] rounded-3xl border border-white/5 p-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#001A0E] border border-white/5 rounded-xl text-xs font-bold hover:bg-white/5">
              Daily
            </button>
            <button className="px-4 py-2 bg-[#001A0E] border border-white/5 rounded-xl text-xs font-bold hover:bg-white/5">
              Weekly
            </button>
            <button className="px-4 py-2 bg-[#001A0E] border border-white/5 rounded-xl text-xs font-bold hover:bg-white/5">
              Monthly
            </button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">
              No expenses yet. Add some to see here!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
              <span>Expense</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-white/5">
              {currentExpenses.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 px-4 py-5 text-sm items-center hover:bg-white/[0.02] transition-colors"
                >
                  {/* Title */}
                  {editId === item.customId ? (
                    <input
                      className="bg-[#001A0E] border border-white/5 rounded-xl px-4 py-3"
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                  ) : (
                    <span className="font-bold">{item.title}</span>
                  )}

                  {editId === item.customId ? (
                    <input
                      className="bg-[#001A0E] border border-white/5 rounded-xl px-4 py-3"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-400">{item.category}</span>
                  )}

                  <span className="text-gray-400">
                    {new Date(item.createdAt || item.date).toLocaleDateString()}
                  </span>

                  {editId === item.customId ? (
                    <input
                      type="number"
                      className="bg-[#001A0E] border border-white/5 rounded-xl px-4 py-3"
                      value={editData.amount}
                      onChange={(e) =>
                        setEditData({ ...editData, amount: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-right font-bold text-[#00D54B]">
                      - ₹{item.amount}
                    </span>
                  )}

                  <div className="flex gap-2 justify-end">
                    {editId === item.customId ? (
                      <>
                        <button
                          onClick={() => {
                            handleUpdateExpense(item.customId, editData);
                            setEditId(null);
                          }}
                          className="text-green-400 text-xs"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="text-gray-400 text-xs"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(item.customId);
                            setEditData({
                              title: item.title,
                              amount: item.amount,
                              category: item.category,
                            });
                          }}
                          className="text-blue-400 text-xs"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteExpense(item.customId)}
                          className="text-red-400 text-xs"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  currentPage === 1
                    ? "bg-white/10 text-gray-400 cursor-not-allowed"
                    : "bg-[#001A0E] text-white hover:bg-white/5"
                }`}
              >
                Previous
              </button>

              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  currentPage === totalPages
                    ? "bg-white/10 text-gray-400 cursor-not-allowed"
                    : "bg-[#001A0E] text-white hover:bg-white/5"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const ReportsView = () => {
    const handleDownloadPDF = () => {
      const doc = new jsPDF();

      doc.text("Expense Report", 14, 15);

      const tableColumn = ["Title", "Category", "Date", "Amount"];

      const tableRows = expenses.map((item) => [
        item.title,
        item.category,
        new Date(item.createdAt || item.date).toLocaleDateString(),
        `₹ ${item.amount}`,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save("expense-report.pdf");
    };

    return (
      <div className="bg-[#002111] rounded-3xl border border-white/5 p-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Reports</h2>

          {expenses.length > 0 && (
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#00D54B] text-[#002111] rounded-xl text-xs font-bold hover:brightness-110"
            >
              Download PDF
            </button>
          )}
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            No data available. Add some expense to generate reports.
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-4 px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
              <span>Title</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5">
              {expenses.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 px-4 py-5 text-sm items-center hover:bg-white/[0.02]"
                >
                  <span className="font-bold">{item.title}</span>
                  <span className="text-gray-400">{item.category}</span>
                  <span className="text-gray-400">
                    {new Date(item.createdAt || item.date).toLocaleDateString()}
                  </span>
                  <span className="text-right font-bold text-[#00D54B]">
                    ₹ {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const AIInsightsView = () => {
    const [messages, setMessages] = useState([
      {
        role: "ai",
        text: "Hi 👋 Ask me anything about your expenses or finance!",
      },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
      if (!input.trim()) return;

      const userMessage = { role: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/callAi/callai",
          {
            prompt: `User expenses: ${JSON.stringify(expenses)}. Question: ${input}`,
          },
        );

        const aiMessage = {
          role: "ai",
          text: res.data.response,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "Something went wrong 😢" },
        ]);
      }

      setLoading(false);
    };

    return (
      <div className="flex flex-col h-[80vh] bg-[#002111] rounded-3xl border border-white/5">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Sparkles className="text-[#00D54B]" />
          <h2 className="font-bold text-lg">AI Assistant</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] w-fit break-words px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "ml-auto bg-[#00D54B] text-[#002111]"
                  : "bg-[#001A0E] text-gray-300"
              }`}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-md font-bold mt-2 mb-1">{children}</h2>
                  ),
                  li: ({ children }) => (
                    <li className="ml-4 list-disc">{children}</li>
                  ),
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm">AI is typing...</div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-[#001A0E] border border-white/5 rounded-xl px-4 py-2 text-sm outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-[#00D54B] text-[#002111] px-4 rounded-xl text-sm font-bold"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  const LeaderboardView = () => {
    const topCategory = leaderboard[0];

    const suggestion = topCategory
      ? `You are spending the most on ${topCategory._id}. Try reducing it by 10% to save ₹${Math.round(
          topCategory.totalAmount * 0.1,
        )}`
      : "";

    const maxAmount = Math.max(
      ...leaderboard.map((i) => i.totalAmount || 0),
      1,
    );

    return (
      <div className="bg-[#002111] rounded-3xl border border-white/5 p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Spending Leaderboard
        </h2>

        {leaderboard.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            No data available. Add some expense to see the leaderboard.
          </div>
        ) : (
          <>
            {topCategory && (
              <div className="mb-6 p-4 rounded-2xl bg-[#00D54B]/10 border border-[#00D54B]/20">
                <p className="text-sm text-[#00D54B] font-semibold">
                  💡 Smart Insight
                </p>
                <p className="text-sm text-gray-300 mt-1">{suggestion}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#001A0E] p-5 rounded-2xl">
                <h3 className="text-sm font-bold mb-4 text-gray-300">
                  Category Spending
                </h3>

                <div className="space-y-4">
                  {leaderboard.map((item, index) => {
                    const percentage = (item.totalAmount / maxAmount) * 100;

                    return (
                      <div key={index}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item._id}</span>
                          <span>₹{item.totalAmount}</span>
                        </div>

                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#001A0E] p-5 rounded-2xl flex justify-center items-center">
                <PieChart width={250} height={250}>
                  <Pie
                    data={leaderboard}
                    dataKey="totalAmount"
                    nameKey="_id"
                    outerRadius={90}
                  >
                    {leaderboard.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#001A0E] text-white font-sans overflow-hidden">
      <aside className="w-64 bg-[#002111] border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#00D54B] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-[#002111] rounded-sm rotate-45" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Expensify</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.name
                  ? "bg-[#00D54B] text-[#002111]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                size={18}
                strokeWidth={activeTab === item.name ? 2.5 : 2}
              />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-1">
          {/* <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            <Settings size={18} /> Settings
          </button> */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#002111]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder={`Search in ${activeTab.toLowerCase()}...`}
              className="w-full bg-[#001A0E] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-[#00D54B]/50 transition-all"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00D54B] text-[#002111] px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#00D54B]/10"
          >
            <Plus size={18} strokeWidth={3} />
            Add Expense
          </button>
        </header>

        <div className="p-8">
          {activeTab === "Dashboard" && <DashboardHome />}
          {activeTab === "Expenses" && <ExpensesView />}
          {activeTab === "Reports" && <ReportsView />}
          {activeTab === "AI Insights" && <AIInsightsView />}
          {activeTab === "Leaderboard" && <LeaderboardView />}
          {activeTab !== "Dashboard" &&
            activeTab !== "Expenses" &&
            activeTab !== "Reports" &&
            activeTab !== "AI Insights" &&
            activeTab !== "Leaderboard" && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="font-bold">{activeTab} Page Coming Soon</p>
              </div>
            )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#002111] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">New Expense</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 px-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Adobe"
                  className="w-full bg-[#001A0E] border border-white/5 rounded-2xl py-3 px-4 text-sm outline-none focus:border-[#00D54B]/50 transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 px-1">
                    Amount (₹)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-[#001A0E] border border-white/5 rounded-2xl py-3 px-4 text-sm outline-none"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 px-1">
                    Category
                  </label>
                  <select
                    className="w-full bg-[#001A0E] border border-white/5 rounded-2xl py-3 px-4 text-sm outline-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Food & Drink</option>
                    <option>Subscription</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl border border-white/5 text-sm font-bold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-[#00D54B] text-[#002111] text-sm font-bold"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
