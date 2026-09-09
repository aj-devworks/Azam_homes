import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Phone, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoginHelpFooter() {
  return (
    <div className="mt-6 text-center text-xs text-gray-400">
      <p className="flex items-center justify-center gap-1.5">
        <Phone size={12} />
        Having trouble logging in? Call{" "}
        <a href="tel:0759392343" className="text-sky-600 hover:underline">
          0759392343
        </a>{" "}
        or{" "}
        <a href="tel:0725685796" className="text-sky-600 hover:underline">
          0725685796
        </a>
      </p>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate(result.role === "manager" ? "/manager" : "/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-sky-600 to-sky-500 text-white flex flex-col justify-center items-center text-center p-8 md:p-10 md:w-2/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
            <ShieldCheck size={32} className="mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">New Here?</h2>
            <p className="text-sky-100 text-sm mb-6">
              Sign up to list or manage your properties with Azam Homes.
            </p>
            <Link
              to="/signup"
              className="border border-white text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white hover:text-sky-600 transition"
            >
              Sign Up
            </Link>
          </div>

          <div className="p-6 sm:p-10 md:w-3/5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center md:text-left">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400 mb-6 text-center md:text-left">
              Log in to continue
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-sky-600" /> Remember me
                </label>
                <a href="#" className="hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-sky-600/25 hover:bg-sky-700 hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-60"
              >
                {submitting ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>

        <LoginHelpFooter />
      </div>
    </div>
  );
}

export default Login;
