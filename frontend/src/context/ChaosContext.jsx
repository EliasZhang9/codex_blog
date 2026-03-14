import { createContext, useContext, useMemo, useState } from "react";

const ChaosContext = createContext(null);

export function ChaosProvider({ children }) {
  const [chaosMode, setChaosMode] = useState(localStorage.getItem("forum-chaos") === "true");

  const toggleChaos = () => {
    setChaosMode((prev) => {
      const next = !prev;
      localStorage.setItem("forum-chaos", String(next));
      return next;
    });
  };

  const value = useMemo(() => ({ chaosMode, toggleChaos }), [chaosMode]);
  return <ChaosContext.Provider value={value}>{children}</ChaosContext.Provider>;
}

export function useChaos() {
  const context = useContext(ChaosContext);
  if (!context) throw new Error("useChaos must be used inside ChaosProvider");
  return context;
}
