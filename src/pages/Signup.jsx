import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    building: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signup(form);
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    // Public signup always creates a manager account — admin accounts are
    // created separately by an existing admin, never through this form.
    navigate("/manager");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col md:flex-row w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-sky-600 to-sky-500 text-white flex flex-col justify-center items-center text-center p-8 md:p-10 md:w-2/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
            <Sparkles size={32} className="mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-sky-100 text-sm mb-6">
              Already have an account? Log in to manage your listings.
            </p>
            <Link
              to="/login"
              className="border border-white text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white hover:text-sky-600 transition"
            >
              Sign In
            </Link>
          </div>

          <div className="p-6 sm:p-10 md:w-3/5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center md:text-left">
              Create your account
            </h1>
            <p className="text-sm text-gray-400 mb-6 text-center md:text-left">
              Start listing in minutes
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
              <input
                name="building"
                type="text"
                placeholder="Building Name"
                value={form.building}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
              <input
                name="password"
                type="password"
                placeholder="Password (min 4 characters)"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-sky-600/25 hover:bg-sky-700 hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-60"
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
