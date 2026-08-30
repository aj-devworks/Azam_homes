import { MapPin, Check, X } from "lucide-react";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

function AdminView() {
  const { listings, approveListing, rejectListing } = useListings();
  const pendingListings = listings.filter((l) => l.status === "pending");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-sky-600 to-sky-500 rounded-b-3xl px-5 sm:px-8 pt-6 pb-7 text-white flex items-center justify-between">
        <div>
          <p className="text-sky-100 text-xs">Admin Dashboard</p>
          <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
            Pending Approvals
          </h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-semibold">
          Ad
        </div>
      </div>

      <div className="px-5 sm:px-8 -mt-5 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-yellow-600">
            {pendingListings.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Awaiting Review</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-gray-900">
            {new Set(pendingListings.map((l) => l.manager)).size}
          </p>
          <p className="text-xs text-gray-400 mt-1">Managers</p>
        </div>
      </div>

      <div className="px-5 sm:px-8 pt-6 space-y-4">
        {pendingListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              No pending listings right now.
            </p>
          </div>
        )}
        {pendingListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="flex">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-28 h-28 object-cover"
              />
              <div className="p-4 flex-1">
                <h2 className="font-semibold text-gray-900">{listing.title}</h2>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  {listing.location}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Posted by {listing.manager}
                </p>
                <p className="text-sky-600 font-bold text-sm mt-1">
                  Ksh {listing.price.toLocaleString()}
                  <span className="text-gray-400 font-normal">/mo</span>
                </p>
              </div>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => approveListing(listing.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 text-green-600 text-sm font-medium hover:bg-green-50 transition"
              >
                <Check size={16} /> Approve
              </button>
              <div className="w-px bg-gray-100" />
              <button
                onClick={() => rejectListing(listing.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 text-red-500 text-sm font-medium hover:bg-red-50 transition"
              >
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default AdminView;
