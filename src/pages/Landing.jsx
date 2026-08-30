// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { Star, ShieldCheck, TrendingUp } from "lucide-react";
import heroImage from "../assets/hero.jpeg";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 sm:px-10 md:px-20 py-5">
        <span className="font-bold text-lg text-gray-900">
          Azam<span className="text-sky-600">Homes</span>
        </span>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-sky-600 px-3 py-2 transition"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row items-center px-6 sm:px-10 md:px-20 pt-6 pb-16 gap-10 md:gap-16">
        <div className="text-center md:text-left max-w-lg">
          <span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full mb-5">
            <TrendingUp size={13} /> Trusted by managers across Nairobi
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-5">
            Fill your spaces <span className="text-sky-600">faster</span>.
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-8 leading-relaxed">
            Post available units, get them reviewed and approved, and put them
            in front of renters actively looking — all in one place.
          </p>
          <div className="flex gap-3 justify-center md:justify-start">
            <Link
              to="/signup"
              className="bg-sky-600 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-600/25 hover:bg-sky-700 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl font-semibold hover:border-sky-300 transition"
            >
              Log In
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex items-center gap-6 mt-8 justify-center md:justify-start">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {["bg-sky-400", "bg-orange-400", "bg-green-400"].map((c, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${c} border-2 border-white`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-1">120+ managers</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              4.8 rating
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative">
          <img
            src={heroImage}
            alt="Azam Homes property"
            className="rounded-3xl shadow-2xl object-cover w-full h-[260px] sm:h-[360px] md:h-[460px]"
          />
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 hidden sm:flex">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">
                Admin-verified
              </p>
              <p className="text-[11px] text-gray-400">
                Every listing reviewed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
