// src/pages/AdminView.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Check,
  X,
  Phone,
  Building2,
  Mail,
  Ban,
  RotateCcw,
  Trash2,
  KeyRound,
} from "lucide-react";
import { useListings } from "../context/ListingsContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import BottomNav from "../components/BottomNav";

function ManagerDetailModal({ managerId, onClose }) {
  const [manager, setManager] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
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

function ManagersSection() {
  const { user: currentUser } = useAuth();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // disables buttons on the row being acted on

  const loadManagers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await api.get("/users");
      setManagers(users.filter((u) => u.role === "manager"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  const handleBan = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/users/${id}/deactivate`);
      await loadManagers();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleUnban = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/users/${id}/activate`);
      await loadManagers();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleResetPassword = async (id, name) => {
    const newPassword = window.prompt(
      `Set a new password for ${name} (min 4 characters):`,
    );
    if (!newPassword) return; // cancelled
    setBusyId(id);
    try {
      await api.patch(`/users/${id}/reset-password`, { password: newPassword });
      alert(`Password reset for ${name}. Share the new password with them directly.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id, name) => {
    // Deleting a manager also deletes every listing they posted — make that
    // consequence explicit before it happens, since it can't be undone.
    const confirmed = window.confirm(
      `Delete ${name}? This permanently removes their account and every listing they posted. This cannot be undone.`,
    );
    if (!confirmed) return;
    setBusyId(id);
    try {
      await api.del(`/users/${id}`);
      setManagers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-5 sm:px-8 pt-8">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">All Managers</h2>

      {loading && <p className="text-sm text-gray-400">Loading managers...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && managers.length === 0 && (
        <p className="text-sm text-gray-400">No managers yet.</p>
      )}

      <div className="space-y-3">
        {managers.map((m) => {
          const isBusy = busyId === m.id;
          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{m.name}</p>
                <p className="text-xs text-gray-400 truncate">{m.email}</p>
                <span
                  className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    m.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {m.is_active ? "Active" : "Banned"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleResetPassword(m.id, m.name)}
                  disabled={isBusy}
                  title="Reset password"
                  className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 transition disabled:opacity-50"
                >
                  <KeyRound size={16} />
                </button>
                {m.is_active ? (
                  <button
                    onClick={() => handleBan(m.id)}
                    disabled={isBusy}
                    title="Ban (blocks login, keeps their listings)"
                    className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 transition disabled:opacity-50"
                  >
                    <Ban size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnban(m.id)}
                    disabled={isBusy}
                    title="Unban"
                    className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition disabled:opacity-50"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  disabled={isBusy}
                  title="Delete permanently (also deletes their listings)"
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
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

      <ManagersSection />

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
