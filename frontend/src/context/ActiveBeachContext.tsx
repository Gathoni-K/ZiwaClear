import { createContext, useContext, useState, type ReactNode } from "react";
import type { Batch } from "../types/batch";

interface ActiveBeachContextValue {
  activeBeach: Batch | null;
  setActiveBeach: (beach: Batch | null) => void;
}

const ActiveBeachContext = createContext<ActiveBeachContextValue | undefined>(undefined);

export function ActiveBeachProvider({ children }: { children: ReactNode }) {
  const [activeBeach, setActiveBeach] = useState<Batch | null>(null);

  return (
    <ActiveBeachContext.Provider value={{ activeBeach, setActiveBeach }}>
      {children}
    </ActiveBeachContext.Provider>
  );
}

export function useActiveBeach(): ActiveBeachContextValue {
  const ctx = useContext(ActiveBeachContext);
  if (!ctx) {
    throw new Error("useActiveBeach must be used within an ActiveBeachProvider");
  }
  return ctx;
}