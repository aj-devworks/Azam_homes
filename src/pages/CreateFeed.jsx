// src/pages/CreateFeed.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

function CreateFeed() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();
  const { addListing } = useListings();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addListing({
      title: form.title,
      location: form.location,
      price: Number(form.price),
      beds: Number(form.beds),
      manager: user?.name || "Unknown",
      ...(imagePreview && { image: imagePreview }),
    });
    navigate("/manager");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-b-3xl px-5 sm:px-8 pt-6 pb-10 text-white">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-sky-100 text-xs">New listing</p>
            <h1 className="text-lg font-bold">Post a Space</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 sm:px-8 -mt-5">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-44 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-8 text-gray-400 cursor-pointer hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50/50 transition">
                <Upload size={24} />
                <p className="text-sm mt-2">Tap to upload a photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. 2 Bedroom Apartment"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Westlands, Nairobi"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Ksh/mo)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="45000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toilets
                </label>
                <input
                  type="number"
                  name="beds"
                  value={form.beds}
                  onChange={handleChange}
                  placeholder="2"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the space..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-600/25 hover:bg-sky-700 hover:-translate-y-0.5 transition-all"
          >
            Submit for Approval
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}

export default CreateFeed;
