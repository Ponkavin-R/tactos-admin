// src/components/AnimatedLogin.js
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AnimatedLogin({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/adminlogin`, {
        email,
        password,
      });
      localStorage.setItem("adminId", res.data.adminId);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-gray-900 to-black flex flex-col items-center justify-center px-6">
      {/* Logo Animation */}
      <motion.h1
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 mb-12 select-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        TACTOS
      </motion.h1>

      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-semibold text-indigo-900 mb-8 text-center tracking-wide">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer placeholder-transparent w-full border-b-2 border-gray-300 focus:border-indigo-500 py-3 text-indigo-900 text-lg outline-none transition"
              placeholder="Email address"
              autoComplete="email"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-5 text-indigo-600 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-indigo-600 peer-focus:text-sm transition-all cursor-text select-none"
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer placeholder-transparent w-full border-b-2 border-gray-300 focus:border-indigo-500 py-3 text-indigo-900 text-lg outline-none transition"
              placeholder="Password"
              autoComplete="current-password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-5 text-indigo-600 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-indigo-600 peer-focus:text-sm transition-all cursor-text select-none"
            >
              Password
            </label>
          </div>

          {error && (
            <motion.p
              className="text-red-600 text-center font-medium select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg
                       shadow-lg hover:shadow-indigo-500/70 hover:bg-indigo-700
                       focus:outline-none focus:ring-4 focus:ring-indigo-400
                       transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
