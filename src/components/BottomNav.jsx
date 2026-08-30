import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Bookmark,
  ClipboardCheck,
  PlusCircle,
  MessageCircle,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function BottomNav() {
  const { user } = useAuth();
  const role = user?.role || "manager";
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

  const navItem = (path, Icon, label) => (
    <Link
      to={path}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
        isActive(path) ? "text-sky-600" : "text-gray-400 hover:text-sky-500"
      }`}
    >
      <Icon size={21} strokeWidth={isActive(path) ? 2.4 : 2} />
      <span
        className={`text-[11px] ${isActive(path) ? "font-semibold" : "font-medium"}`}
      >
        {label}
      </span>
      {isActive(path) && (
        <span className="w-1 h-1 rounded-full bg-sky-600 mt-0.5" />
      )}
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 pt-2 pb-3">
        <div className="flex justify-around items-end max-w-md mx-auto">
          {navItem("/feed", Home, "Home")}
          {role === "manager"
            ? navItem("/manager", Bookmark, "Listings")
            : navItem("/admin", ClipboardCheck, "Approvals")}
          <Link
            to={role === "manager" ? "/create" : "/create-alert"}
            className="flex flex-col items-center -mt-7 bg-sky-600 text-white rounded-full p-3.5 shadow-lg shadow-sky-600/30 hover:bg-sky-700 hover:-translate-y-0.5 transition-all"
          >
            {role === "manager" ? (
              <PlusCircle size={24} />
            ) : (
              <MessageCircle size={24} />
            )}
          </Link>
          {navItem("/messages", MessageCircle, "Messages")}
          {navItem("/profile", User, "Profile")}
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
