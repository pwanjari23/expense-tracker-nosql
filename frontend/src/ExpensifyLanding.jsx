import React, { useState } from "react";
import { Check, Star, X, ChevronRight, Mail, Phone } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExpensifyLanding = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");

  const [message, setMessage] = useState("");

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSignup = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        headers: { Authorization: `Bearer ${token}` },
        name,
        email,
        phone,
      });
      console.log("Signup response:", res.data);
      setMessage(`Welcome ${res.data.user.name}!`);
      setIsModalOpen(false);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLogin = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        headers: { Authorization: `Bearer ${token}` },
        email: identifier,
        phone: identifier,
      });
      console.log("Login response:", res.data);
      setMessage(`Welcome back ${res.data.user.name}!`);
      setIsModalOpen(false);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#002111] text-white font-sans selection:bg-[#00D54B] selection:text-[#002111] overflow-x-hidden relative">
      <div className="bg-[#00381C] py-2 px-4 text-center text-[11px] sm:text-xs flex justify-center items-center gap-2 border-b border-white/5">
        <span className="text-sm">🏆</span>
        <p className="font-medium opacity-90">
          Expensify named a TrustRadius Buyer's Choice 2026 award winner.
          <a href="#" className="underline ml-1 hover:text-[#00D54B]">
            Read more →
          </a>
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <header className="flex justify-between items-center py-6 md:py-8">
          <h1 className="text-2xl font-bold tracking-tight">Expensify</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00D54B] text-[#002111] px-6 py-2 rounded-full font-bold text-sm hover:brightness-110 transition-all"
          >
            Sign In
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-center pt-4 pb-20">
          <div className="z-10 max-w-2xl">
            <h2 className="text-[40px] md:text-[56px] lg:text-[68px] font-serif leading-[1.05] mb-8">
              The{" "}
              <span className="italic font-normal text-[#00D54B]">easiest</span>{" "}
              way <br />
              to do your expenses
            </h2>

            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <Check
                  className="mt-1 flex-shrink-0 text-[#00D54B]"
                  size={18}
                  strokeWidth={3}
                />
                <p className="text-[15px] leading-relaxed">
                  <span className="font-bold">Take control of your money.</span>{" "}
                  See where every rupee goes and manage your spending
                  effortlessly.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check
                  className="mt-1 flex-shrink-0 text-[#00D54B]"
                  size={18}
                  strokeWidth={3}
                />
                <p className="text-[15px] leading-relaxed">
                  <span className="font-bold">AI insights & leaderboard.</span>{" "}
                  See trends and compare your habits.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-bold mb-4 text-[15px]">You can track:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "daily", label: "Daily expenses" },
                  { id: "weekly", label: "Weekly expenses" },
                  { id: "monthly", label: "Monthly expenses" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`h-32 p-4 rounded-xl border flex flex-col justify-between text-left transition-all ${
                      selected.includes(item.id)
                        ? "bg-[#A8F2D0] border-transparent text-black"
                        : "bg-[#002E18] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected.includes(item.id) ? "border-black" : "border-white/30"}`}
                    >
                      {selected.includes(item.id) && (
                        <div className="w-2.5 h-2.5 bg-black rounded-full" />
                      )}
                    </div>
                    <span className="font-bold text-sm leading-snug">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl sm:rounded-full p-1.5 max-w-[550px] shadow-2xl">
              <input
                type="text"
                placeholder="Enter your email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="flex-1 px-5 py-3 outline-none text-black text-[15px] rounded-full"
              />
              <button
                onClick={handleLogin}
                className="bg-[#00D54B] text-[#002111] px-7 py-3 rounded-full font-bold text-[15px] hover:bg-[#00c044] transition-colors whitespace-nowrap"
              >
                Login
              </button>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="relative translate-x-4 lg:translate-x-12">
              <div className="rounded-tl-2xl border-t-4 border-l-4 border-white/10 shadow-2xl overflow-hidden bg-[#F9FAFB]">
                <img
                  src="https://d2k5nsl2zxldvw.cloudfront.net/images/homepage/2024/hero_screenshot_f1.png"
                  alt="Dashboard UI"
                  className="w-full h-auto opacity-90 mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-[400px] h-full bg-[#002111] shadow-2xl p-8 flex flex-col animate-slide-in border-l border-white/5">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-2xl font-bold tracking-tight">Expensify</h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-2xl font-serif leading-tight mb-8">
                Welcome! <br />
                Enter your details to start.
              </h3>

              <div className="space-y-4 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#002E18] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00D54B]/50 focus:ring-1 focus:ring-[#00D54B]/50 transition-all text-[15px] placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#002E18] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00D54B]/50 focus:ring-1 focus:ring-[#00D54B]/50 transition-all text-[15px] placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#002E18] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00D54B]/50 focus:ring-1 focus:ring-[#00D54B]/50 transition-all text-[15px] placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-[#00D54B] text-[#002111] p-4 mt-2 rounded-full font-bold text-[15px] hover:brightness-105 transition-all flex justify-center items-center gap-2 mt-2"
                  onClick={handleSignup}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mt-auto border-t border-white/5 pt-6 pb-2">
                <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                  By logging in, you agree to our <br />
                  <a href="#" className="text-[#00D54B] hover:underline">
                    terms of service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#00D54B] hover:underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `,
        }}
      />
    </div>
  );
};

export default ExpensifyLanding;
