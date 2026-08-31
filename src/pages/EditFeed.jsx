import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

function EditFeed() {
  const { id } = useParams();
  const { listings, updateListing } = useListings();
  const navigate = useNavigate();
  const listing = listings.find((l) => l.id === Number(id));

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    toilets: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title || "",
        location: listing.location || "",
        price: listing.price || "",
        beds: listing.beds || "",
        toilets: listing.toilets || "",
        description: listing.description || "",
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.price || Number(form.price) <= 0)
      next.price = "Enter a valid price";
    if (!form.beds || Number(form.beds) <= 0)
      next.beds = "Enter at least 1 bedroom";
    if (form.toilets === "" || Number(form.toilets) < 0)
      next.toilets = "Enter number of toilets";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    updateListing(Number(id), {
      title: form.title,
      location: form.location,
      price: Number(form.price),
      beds: Number(form.beds),
      toilets: Number(form.toilets),
      description: form.description,
    });
    navigate("/manager");
  };

  const inputClass = (field) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:bg-white transition ${
      errors[field]
        ? "border-red-300 focus:ring-red-400"
        : "border-gray-200 focus:ring-sky-500"
    }`;

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Listing not found.
      </div>
    );
  }

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
            <p className="text-sky-100 text-xs">Edit listing</p>
            <h1 className="text-lg font-bold">Update Space</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="px-5 sm:px-8 -mt-5">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
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
                className={inputClass("location")}
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
                className={inputClass("price")}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="beds"
                  value={form.beds}
                  onChange={handleChange}
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
                  className={inputClass("toilets")}
                />
                {errors.toilets && (
                  <p className="text-red-500 text-xs mt-1">{errors.toilets}</p>
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-600/25 hover:bg-sky-700 hover:-translate-y-0.5 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}

export default EditFeed;
