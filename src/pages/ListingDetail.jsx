import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath } from "lucide-react";
import { useListings } from "../context/ListingsContext";
import BottomNav from "../components/BottomNav";

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

function ListingDetail() {
  const { id } = useParams();
  const { listings } = useListings();
  const navigate = useNavigate();
  const listing = listings.find((l) => l.id === Number(id));

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
            <p className="text-sky-100 text-xs">Listing</p>
            <h1 className="text-lg font-bold">{listing.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 -mt-5">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{listing.title}</h2>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[listing.status]}`}
            >
              {listing.status}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={15} className="mr-1.5" />
            {listing.location}
          </div>

          <div className="flex gap-4 text-gray-600 text-sm">
            <span className="flex items-center gap-1">
              <Bed size={15} /> {listing.beds} bed
              {listing.beds !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Bath size={15} /> {listing.toilets || 0} toilet
              {listing.toilets !== 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-sky-600 font-bold text-xl">
            Ksh {listing.price.toLocaleString()}
            <span className="text-gray-400 font-normal text-sm">/mo</span>
          </p>

          {listing.description && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Posted by {listing.manager}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default ListingDetail;
