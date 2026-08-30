import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useAlerts } from "../context/AlertsContext";
import BottomNav from "../components/BottomNav";

function CreateAlert() {
  const [form, setForm] = useState({ title: "", message: "" });
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAlert(form);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-b-3xl px-5 sm:px-8 pt-6 pb-10 text-white flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-sky-100 text-xs">Broadcast</p>
          <h1 className="text-lg font-bold">Send Message</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-5 sm:px-8 -mt-5 max-w-lg mx-auto space-y-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
          <div className="flex items-center justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-sky-500">
              <MessageCircle size={28} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Maintenance notice"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Write the message for managers..."
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-600/25 hover:bg-sky-700 hover:-translate-y-0.5 transition-all"
        >
          Send to All Managers
        </button>
      </form>

      <BottomNav />
    </div>
  );
}

export default CreateAlert;
