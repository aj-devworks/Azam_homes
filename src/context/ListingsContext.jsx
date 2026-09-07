import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const ListingsContext = createContext(null);

// The backend uses bedrooms/bathrooms; the UI was built around beds/toilets.
// These two helpers keep that mapping in one place.
function toUiShape(p) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    location: p.location,
    price: p.price,
    beds: p.bedrooms,
    toilets: p.bathrooms,
    areaSqft: p.area_sqft,
    propertyType: p.property_type,
    status: p.status, // "pending" | "approved" | "rejected" | "sold"
    manager: p.manager_name,
    managerId: p.manager_id,
    images: p.images,
    createdAt: p.created_at,
  };
}

function toApiShape(data) {
  const out = {};
  if (data.title !== undefined) out.title = data.title;
  if (data.description !== undefined) out.description = data.description;
  if (data.location !== undefined) out.location = data.location;
  if (data.price !== undefined) out.price = data.price;
  if (data.beds !== undefined) out.bedrooms = data.beds;
  if (data.toilets !== undefined) out.bathrooms = data.toilets;
  if (data.areaSqft !== undefined) out.area_sqft = data.areaSqft;
  if (data.propertyType !== undefined) out.property_type = data.propertyType;
  if (data.images !== undefined) out.images = data.images;
  return out;
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // per_page=100 keeps this simple; swap in real pagination if the
      // listing count grows past that.
      const data = await api.get("/properties?per_page=100");
      setListings(data.items.map(toUiShape));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addListing = async (data) => {
    const created = await api.post("/properties", toApiShape(data));
    setListings((prev) => [toUiShape(created), ...prev]);
    return created;
  };

  const updateListing = async (id, data) => {
    const updated = await api.patch(`/properties/${id}`, toApiShape(data));
    setListings((prev) => prev.map((l) => (l.id === id ? toUiShape(updated) : l)));
    return updated;
  };

  const approveListing = async (id) => {
    const updated = await api.patch(`/properties/${id}/approve`);
    setListings((prev) => prev.map((l) => (l.id === id ? toUiShape(updated) : l)));
  };

  const rejectListing = async (id) => {
    const updated = await api.patch(`/properties/${id}/reject`);
    setListings((prev) => prev.map((l) => (l.id === id ? toUiShape(updated) : l)));
  };

  const deleteListing = async (id) => {
    await api.del(`/properties/${id}`);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        loading,
        error,
        refresh,
        addListing,
        updateListing,
        approveListing,
        rejectListing,
        deleteListing,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  return useContext(ListingsContext);
}
