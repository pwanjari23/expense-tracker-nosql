import React, { useState } from "react";
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
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Expenses", icon: Receipt },
    { name: "Reports", icon: BarChart3 },
    { name: "AI Insights", icon: Sparkles },
    { name: "Leaderboard", icon: Trophy },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#001A0E] text-white font-sans overflow-hidden">
      {/* 1. MINIMAL SIDEBAR */}
      <aside className="w-64 bg-[#002111] border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#00D54B] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-[#002111] rounded-sm rotate-45" />
          </div>
          <h1 className="text-xl font-bold italic tracking-tight">Expensify</h1>
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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            <Settings size={18} /> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-400/10 rounded-xl transition-all" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#002111]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search expenses, tags, or reports..."
              className="w-full bg-[#001A0E] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-[#00D54B]/50 transition-all"
            />
          </div>

          <button className="bg-[#00D54B] text-[#002111] px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#00D54B]/10">
            <Plus size={18} strokeWidth={3} />
            Add Expense
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 space-y-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#002111] p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ArrowUpRight size={80} />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                Monthly Budget
              </p>
              <h3 className="text-3xl font-serif">₹45,000.00</h3>
              <div className="mt-4 flex items-center gap-2 text-[#00D54B] text-xs font-bold">
                <span className="bg-[#00D54B]/10 px-2 py-0.5 rounded-md">
                  82% Used
                </span>
              </div>
            </div>

            <div className="bg-[#002111] p-6 rounded-3xl border border-white/5">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                Total Spending
              </p>
              <h3 className="text-3xl font-serif">₹32,410.50</h3>
              <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold">
                <span className="bg-red-400/10 px-2 py-0.5 rounded-md">
                  +12.5% from last month
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
                You can save ₹3,200 by optimizing subscriptions.
              </h3>
              <button className="mt-4 text-xs font-black underline underline-offset-4 uppercase">
                See How
              </button>
            </div>
          </div>

          {/* Recent Activity & Leaderboard Preview */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Expense Table */}
            <div className="lg:col-span-2 bg-[#002111] rounded-3xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold">Recent Expenses</h4>
                <button className="text-[#00D54B] text-xs font-bold hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    name: "Adobe Creative Cloud",
                    cat: "Subscription",
                    amt: "- ₹2,400",
                    date: "Mar 24",
                  },
                  {
                    name: "Starbucks Coffee",
                    cat: "Food & Drink",
                    amt: "- ₹450",
                    date: "Mar 23",
                  },
                  {
                    name: "Uber Premium",
                    cat: "Transport",
                    amt: "- ₹1,200",
                    date: "Mar 23",
                  },
                ].map((ex, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#001A0E] rounded-full flex items-center justify-center text-[#00D54B] font-bold">
                        {ex.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{ex.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {ex.cat} • {ex.date}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-gray-200">{ex.amt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Small Component */}
            <div className="bg-[#002111] rounded-3xl border border-white/5 p-6">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" /> Leaderboard
              </h4>
              <div className="space-y-6">
                {[
                  {
                    rank: 1,
                    user: "Arjun S.",
                    score: "98 pts",
                    color: "#00D54B",
                  },
                  {
                    rank: 2,
                    user: "Priya K.",
                    score: "92 pts",
                    color: "#8b5cf6",
                  },
                  { rank: 3, user: "You", score: "88 pts", color: "#fbbf24" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-4">
                      #{user.rank}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold">{user.user}</span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {user.score}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: user.score.replace(" pts", "%"),
                            backgroundColor: user.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
