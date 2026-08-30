import { MapPin, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

function ManagerView() {
  const { user } = useAuth();
  const { listings, deleteListing } = useListings();
  const myListings = listings.filter((l) => l.manager === user?.name);

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This can't be undone.`))
      deleteListing(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-b-3xl px-5 sm:px-8 pt-6 pb-7 text-white flex items-center justify-between">
        <div>
          <p className="text-sky-100 text-xs">Manager Dashboard</p>
          <h1 className="text-xl sm:text-2xl font-bold mt-0.5">My Listings</h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-semibold">
          {user?.name?.charAt(0) || "M"}
        </div>
      </div>

      <div className="px-5 sm:px-8 -mt-5 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-gray-900">{myListings.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-green-600">
            {myListings.filter((l) => l.status === "approved").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-yellow-600">
            {myListings.filter((l) => l.status === "pending").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pending</p>
        </div>
      </div>

      <div className="px-5 sm:px-8 pt-6 space-y-4">
        {myListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              You haven't posted any listings yet.
            </p>
          </div>
        )}
        {myListings.map((listing) => (
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
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sky-600 font-bold text-sm">
                  Ksh {listing.price.toLocaleString()}
                  <span className="text-gray-400 font-normal">/mo</span>
                </p>
                <div className="flex gap-3 text-gray-400">
                  <button className="hover:text-sky-600 transition">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id, listing.title)}
                    className="hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default ManagerView;
