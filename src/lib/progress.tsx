import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BADGES } from "./floodguard-data";

type Progress = {
  points: number;
  actions: string[];
};

const STORAGE_KEY = "floodguard.progress.v1";
const empty: Progress = { points: 0, actions: [] };

type Ctx = Progress & {
  earnedBadges: typeof BADGES;
  addPoints: (amount: number, action: string) => void;
  hasAction: (action: string) => boolean;
  reset: () => void;
  lastBadge: string | null;
};

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Progress>(empty);
  const [lastBadge, setLastBadge] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as Progress);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Progress) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const earnedBadges = useMemo(
    () => BADGES.filter((b) => state.points >= b.points),
    [state.points],
  );

  const addPoints = useCallback((amount: number, action: string) => {
    setState((prev) => {
      const next = { points: prev.points + amount, actions: [...prev.actions, action].slice(-100) };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      const before = BADGES.filter((b) => prev.points >= b.points).length;
      const after = BADGES.filter((b) => next.points >= b.points).length;
      if (after > before) setLastBadge(BADGES[after - 1]!.id);
      return next;
    });
  }, []);

  const value: Ctx = {
    ...state,
    earnedBadges,
    addPoints,
    hasAction: (action) => state.actions.includes(action),
    reset: () => {
      persist(empty);
      setLastBadge(null);
    },
    lastBadge,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
