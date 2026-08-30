// src/pages/Profile.jsx
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Building2,
  LogOut,
  Camera,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  FileText,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

function Profile() {
  const { user, logout } = useAuth();
  const { listings } = useListings();
  const navigate = useNavigate();
  const role = user?.role || "manager";
  const myListings = listings.filter((l) => l.manager === user?.name);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const settingsItems = [
    { icon: Shield, label: "Privacy & security" },
    { icon: Bell, label: "Notification settings" },
    { icon: FileText, label: "Terms & policies" },
    { icon: HelpCircle, label: "Help & support" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover banner */}
      <div className="relative h-32 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Avatar + identity, overlapping the banner */}
      <div className="px-5 sm:px-8 -mt-14">
        <div className="flex items-end justify-between">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-3xl font-bold ring-4 ring-white shadow-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center ring-2 ring-white hover:bg-sky-700 transition">
              <Camera size={13} />
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 transition mb-2"
          >
            Log out
          </button>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
          <span className="inline-block text-xs font-medium bg-sky-50 text-sky-600 px-2.5 py-0.5 rounded-full mt-1 capitalize">
            {role}
          </span>
        </div>

        {/* Stat chips */}
        <div className="flex gap-3 mt-5">
          {role === "manager" ? (
            <>
              <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-gray-900">
                  {myListings.length}
                </p>
                <p className="text-[11px] text-gray-400">Listings</p>
              </div>
              <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-green-600">
                  {myListings.filter((l) => l.status === "approved").length}
                </p>
                <p className="text-[11px] text-gray-400">Approved</p>
              </div>
              <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-yellow-600">
                  {myListings.filter((l) => l.status === "pending").length}
                </p>
                <p className="text-[11px] text-gray-400">Pending</p>
              </div>
            </>
          ) : (
            <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-sky-600">
                {listings.length}
              </p>
              <p className="text-[11px] text-gray-400">
                Total listings on platform
              </p>
            </div>
          )}
        </div>

        {/* Contact info */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-6 mb-2 px-1">
          Contact info
        </p>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center">
              <Mail size={16} className="text-sky-500" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Email</p>
              <p className="text-sm text-gray-800">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center">
              <Phone size={16} className="text-sky-500" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Phone</p>
              <p className="text-sm text-gray-800">{user?.phone}</p>
            </div>
          </div>
          {role === "manager" && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center">
                <Building2 size={16} className="text-sky-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Building</p>
                <p className="text-sm text-gray-800">{user?.building}</p>
              </div>
            </div>
          )}
        </div>

        {/* Settings list */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-6 mb-2 px-1">
          Settings
        </p>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          {settingsItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition text-left"
            >
              <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                <Icon size={16} className="text-gray-400" />
              </div>
              <span className="text-sm text-gray-800 flex-1">{label}</span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-500 font-medium mt-6 py-3 rounded-xl border border-red-100 hover:bg-red-50 transition"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile;
