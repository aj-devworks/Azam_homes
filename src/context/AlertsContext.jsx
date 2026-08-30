import { createContext, useContext, useState, useEffect } from "react";

const AlertsContext = createContext(null);

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("azam_alerts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("azam_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (data) => {
    setAlerts((prev) => [{ id: Date.now(), ...data }, ...prev]);
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertsContext);
}
