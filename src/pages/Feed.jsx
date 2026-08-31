// src/pages/Feed.jsx
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

function Feed() {
  const { user } = useAuth();
  const { listings } = useListings();
  const [search, setSearch] = useState("");
  const role = user?.role || "manager";

  const base =
    role === "admin"
      ? listings
      : listings.filter((l) => l.manager === user?.name);

  const properties = base.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-b-3xl px-5 sm:px-8 pt-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sky-100 text-xs">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
              {role === "admin" ? "All listings" : "My Listings"}
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
            placeholder="Search by title or location..."
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="px-5 sm:px-8 pt-6 pb-2">
        <h2 className="font-semibold text-gray-900">
          {properties.length} listing{properties.length !== 1 ? "s" : ""}
        </h2>
      </div>

      <div className="px-5 sm:px-8 space-y-4">
        {properties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              {role === "admin"
                ? "No listings match your search."
                : "You haven't posted any listings yet."}
            </p>
          </div>
        )}
        {properties.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex"
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="w-28 h-28 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">
                    {listing.title}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[listing.status]}`}
                  >
                    {listing.status}
                  </span>
                </div>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  {listing.location}
                </div>
                {role === "admin" && (
                  <p className="text-xs text-gray-400 mt-1">
                    Posted by {listing.manager}
                  </p>
                )}
              </div>
              <p className="text-sky-600 font-bold text-sm">
                Ksh {listing.price.toLocaleString()}
                <span className="text-gray-400 font-normal">/mo</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default Feed;
