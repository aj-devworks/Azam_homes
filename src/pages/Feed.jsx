// src/pages/Feed.jsx
import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

const categories = ["All", "Apartments", "Studios", "Houses"];

function getCategory(property) {
  if (property.beds === 1) return "Studios";
  if (property.beds >= 3) return "Houses";
  return "Apartments";
}

function Feed() {
  const { user } = useAuth();
  const { listings } = useListings();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const properties = listings
    .filter((l) => l.status === "approved")
    .filter((l) => l.location.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (l) => activeCategory === "All" || getCategory(l) === activeCategory,
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-b-3xl px-5 sm:px-8 pt-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sky-100 text-xs">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
              Find your next space
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
            {user?.name?.charAt(0) || "A"}
          </div>
        </div>

        <div className="flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-lg">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location..."
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
          <button className="text-sky-600 border-l border-gray-200 pl-3">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 sm:px-8 pt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition ${
              activeCategory === cat
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="px-5 sm:px-8 pt-6 pb-2 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">
          {properties.length} spaces available
        </h2>
      </div>

      {/* Property grid */}
      <div className="px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-400 text-sm">
              No spaces match your search.
            </p>
          </div>
        )}
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden cursor-pointer group"
          >
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-gray-700">
                {property.beds} bed{property.beds > 1 ? "s" : ""}
              </span>
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-full text-gray-700 flex items-center gap-1">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />{" "}
                New
              </span>
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-gray-900 truncate">
                {property.title}
              </h2>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                {property.location}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-sky-600 font-bold">
                  Ksh {property.price.toLocaleString()}
                  <span className="text-gray-400 font-normal text-sm">/mo</span>
                </p>
                <button className="text-xs font-semibold text-white bg-sky-600 rounded-full px-4 py-1.5 hover:bg-sky-700 transition">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default Feed;
