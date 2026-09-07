// src/pages/AdminView.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Check, X, Phone, Building2, Mail } from "lucide-react";
import { useListings } from "../context/ListingsContext";
import { api } from "../services/api";
import BottomNav from "../components/BottomNav";

function ManagerDetailModal({ managerId, onClose }) {
  const [manager, setManager] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Admin-only endpoint — returns every account, including phone/building.
        const users = await api.get("/users");
        if (cancelled) return;
        const found = users.find((u) => u.id === managerId);
        if (!found) {
          setError("Manager not found");
        } else {
          setManager(found);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [managerId]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl sm:rounded-2xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {!manager && !error && (
          <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
        )}
        {error && <p className="text-sm text-red-500 text-center py-6">{error}</p>}

        {manager && (
          <>
            <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg mb-3">
              {manager.name?.[0]?.toUpperCase() || "?"}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{manager.name}</h2>
            <p className="text-xs text-gray-400 mb-4">Manager</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <span>{manager.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={16} className="text-gray-400 shrink-0" />
                <span>{manager.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Building2 size={16} className="text-gray-400 shrink-0" />
                <span>{manager.building || "Not provided"}</span>
              </div>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function AdminView() {
  const { listings, approveListing, rejectListing } = useListings();
  const [openManagerId, setOpenManagerId] = useState(null);
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
            {new Set(pendingListings.map((l) => l.managerId)).size}
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
            <div className="p-4">
              <Link
                to={`/listing/${listing.id}`}
                className="font-semibold text-gray-900 hover:text-sky-600 transition"
              >
                {listing.title}
              </Link>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                {listing.location}
              </div>
              {/* Clicking the manager's name opens their full details —
                  phone, building, email — fetched fresh from the admin-only
                  /users endpoint rather than being baked into the listing. */}
              <button
                onClick={() => setOpenManagerId(listing.managerId)}
                className="text-xs text-sky-600 hover:underline mt-1"
              >
                Posted by {listing.manager}
              </button>
              <p className="text-sky-600 font-bold text-sm mt-1">
                Ksh {listing.price.toLocaleString()}
                <span className="text-gray-400 font-normal">/mo</span>
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={async () => {
                  try {
                    await approveListing(listing.id);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 text-green-600 text-sm font-medium hover:bg-green-50 transition"
              >
                <Check size={16} /> Approve
              </button>
              <div className="w-px bg-gray-100" />
              <button
                onClick={async () => {
                  try {
                    await rejectListing(listing.id);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 text-red-500 text-sm font-medium hover:bg-red-50 transition"
              >
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {openManagerId && (
        <ManagerDetailModal
          managerId={openManagerId}
          onClose={() => setOpenManagerId(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}

export default AdminView;
