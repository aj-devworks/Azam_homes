// src/pages/CreateFeed.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

const toTitleCase = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function CreateFeed() {
  const [type, setType] = useState("bedroom"); // 'bedroom' | 'shop'
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    toilets: "",
    description: "",
    stock: "in_stock",
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { addListing } = useListings();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (type === "bedroom" && !form.title.trim())
      next.title = "Title is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.price || Number(form.price) <= 0)
      next.price = "Enter a valid price";
    if (type === "bedroom") {
      if (!form.beds || Number(form.beds) <= 0)
        next.beds = "Enter at least 1 bedroom";
      if (form.toilets === "" || Number(form.toilets) < 0)
        next.toilets = "Enter number of toilets";
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const locationClean = toTitleCase(form.location.trim());

    const base = {
      type,
      title:
        type === "bedroom"
          ? toTitleCase(form.title.trim())
          : `Shop — ${locationClean}`,
      location: locationClean,
      price: Number(form.price),
      manager: user?.name || "Unknown",
    };

    addListing(
      type === "bedroom"
        ? {
            ...base,
            beds: Number(form.beds),
            toilets: Number(form.toilets),
            description: form.description.trim()
              ? capitalizeFirst(form.description.trim())
              : "",
          }
        : { ...base, stock: form.stock },
    );
    navigate("/manager");
  };

  const inputClass = (field) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:bg-white transition ${
      errors[field]
        ? "border-red-300 focus:ring-red-400"
        : "border-gray-200 focus:ring-sky-500"
    }`;

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

      <form onSubmit={handleSubmit} noValidate className="px-5 sm:px-8 -mt-5">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Space type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("bedroom")}
                  className={`py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                    type === "bedroom"
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"
                  }`}
                >
                  Bedrooms
                </button>
                <button
                  type="button"
                  onClick={() => setType("shop")}
                  className={`py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                    type === "shop"
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"
                  }`}
                >
                  Shop
                </button>
              </div>
            </div>

            {type === "bedroom" && (
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
                  className={`${inputClass("title")} capitalize`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>
            )}

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
                className={`${inputClass("location")} capitalize`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

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
                className={inputClass("price")}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            {type === "bedroom" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor no
                    </label>
                    <input
                      type="number"
                      name="beds"
                      value={form.beds}
                      onChange={handleChange}
                      placeholder="1"
                      className={inputClass("beds")}
                    />
                    {errors.beds && (
                      <p className="text-red-500 text-xs mt-1">{errors.beds}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Toilets
                    </label>
                    <input
                      type="number"
                      name="toilets"
                      value={form.toilets}
                      onChange={handleChange}
                      placeholder="1"
                      className={inputClass("toilets")}
                    />
                    {errors.toilets && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.toilets}
                      </p>
                    )}
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
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                >
                  <option value="in_stock">With Stock</option>
                  <option value="out_of_stock">Without Stock</option>
                </select>
              </div>
            )}
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
