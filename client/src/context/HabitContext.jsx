import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { api } from "../api.js";
import {
  format,
  subDays,
  isSameDay,
  parseISO,
  isToday,
  isYesterday,
} from "date-fns";

const Ctx = createContext(null);
export const useHabits = () => useContext(Ctx);

/**
 * Logic to calculate streaks considering "Shielded" days as valid streak-savers
 */
const calculateSmartStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;

  let streak = 0;
  let dayOffset = 0;

  // Check if habit was done today or yesterday. If neither, streak is 0.
  const doneToday = completions.find(
    (c) =>
      isSameDay(parseISO(c.date), new Date()) && (c.completed || c.shielded),
  );
  const doneYesterday = completions.find(
    (c) =>
      isSameDay(parseISO(c.date), subDays(new Date(), 1)) &&
      (c.completed || c.shielded),
  );

  if (!doneToday && !doneYesterday) return 0;

  // Start counting backward
  dayOffset = doneToday ? 0 : 1;

  while (true) {
    const targetDate = format(subDays(new Date(), dayOffset), "yyyy-MM-dd");
    const dayData = completions.find((c) => c.date === targetDate);

    if (dayData && (dayData.completed || dayData.shielded)) {
      streak++;
      dayOffset++;
    } else {
      break;
    }
  }
  return streak;
};

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [meta, setMeta] = useState({
    today: "",
    objectivesDue: "0/0",
    syncEfficiency: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setHabits(data.habits);
      setMeta(data.meta);
      setError(null);
    } catch (e) {
      setError({ status: e.status ?? 0, message: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = async (name) => {
    await api.create(name);
    refresh();
  };

  /**
   * Updated Toggle Logic:
   * Cycles through: Empty -> Completed -> Shielded -> Empty
   */
  const toggle = async (id, date) => {
    const dateObj = parseISO(date);

    // RESTRICTION: Only allow Today and Yesterday to be edited
    if (!isToday(dateObj) && !isYesterday(dateObj)) {
      setError({
        status: 403,
        message: "SYSTEM_LOCK: Neural records older than 24h are permanent.",
      });
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
      return;
    }
    const habit = habits.find((h) => h.id === id);
    const existing = habit?.completions?.find((c) => c.date === date);

    try {
      if (!existing) {
        // State 1: Mark as Completed
        await api.toggle(id, date, { completed: true, shielded: false });
      } else if (existing.completed) {
        // State 2: Switch from Completed to Shielded
        await api.toggle(id, date, { completed: false, shielded: true });
      } else {
        // State 3: Remove record (Incomplete)
        await api.toggle(id, date, { remove: true });
      }
      refresh();
    } catch (e) {
      setError({
        status: 500,
        message: "Sync Error: Protocol Override Failed.",
      });
    }
  };

  const removeHabit = async (id) => {
    await api.remove(id);
    refresh();
  };

  const clearAll = async () => {
    await api.clear();
    refresh();
  };

  // Enhance habit objects with their calculated streak before passing to components
  const habitsWithStreaks = useMemo(() => {
    return habits.map((h) => ({
      ...h,
      currentStreak: calculateSmartStreak(h.completions || []),
    }));
  }, [habits]);

  return (
    <Ctx.Provider
      value={{
        habits: habitsWithStreaks,
        meta,
        error,
        loading,
        refresh,
        addHabit,
        toggle,
        removeHabit,
        clearAll,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
