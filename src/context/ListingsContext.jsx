import { createContext, useContext, useState, useEffect } from "react";

const ListingsContext = createContext(null);

const defaultListings = [
  {
    id: 1,
    title: "2 Bedroom Apartment",
    location: "Westlands, Nairobi",
    price: 45000,
    beds: 2,
    toilets: 1,
    status: "approved",
    manager: "Fatima Ahmed",
  },
  {
    id: 2,
    title: "Studio Space",
    location: "Kilimani, Nairobi",
    price: 25000,
    beds: 1,
    toilets: 1,
    status: "pending",
    manager: "Fatima Ahmed",
  },
  {
    id: 3,
    title: "3 Bedroom House",
    location: "Karen, Nairobi",
    price: 90000,
    beds: 3,
    toilets: 2,
    status: "pending",
    manager: "John Kamau",
  },
];

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem("azam_listings");
    return saved ? JSON.parse(saved) : defaultListings;
  });

  useEffect(() => {
    localStorage.setItem("azam_listings", JSON.stringify(listings));
  }, [listings]);

  const addListing = (data) => {
    const newListing = { id: Date.now(), status: "pending", ...data };
    setListings((prev) => [newListing, ...prev]);
  };

  const updateListing = (id, data) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...data } : l)),
    );
  };

  const approveListing = (id) =>
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l)),
    );
  const rejectListing = (id) =>
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "rejected" } : l)),
    );
  const deleteListing = (id) =>
    setListings((prev) => prev.filter((l) => l.id !== id));

  return (
    <ListingsContext.Provider
      value={{
        listings,
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
