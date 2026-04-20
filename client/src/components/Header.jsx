import { useMemo, useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { format, subDays } from "date-fns";
import { useHabits } from "../context/HabitContext";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { habits, addHabit, clearAll } = useHabits();
  const [name, setName] = useState("");
  const [isLight, setIsLight] = useState(false);

  // 1. Theme Logic: Toggle the "light" class on the <html> element
  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [isLight]);

  const toggleProtocol = (e) => {
    e.preventDefault(); // Prevent form submission if button is inside form
    setIsLight(!isLight);
  };

  // 2. Habit Submission
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name.trim());
    setName("");
  };

  // 3. Neural Pulse Path Calculation (Last 30 Days)
  const pulsePath = useMemo(() => {
    const points = [];
    const totalHabits = habits.length;
    const width = 1200;
    const padding = 40; // Midpoint baseline

    for (let i = 0; i <= 30; i++) {
      const date = format(subDays(new Date(), 30 - i), "yyyy-MM-dd");

      const completedCount = habits.reduce((acc, h) => {
        const isDone = h.completions?.some(
          (c) => c.date === date && c.completed
        );
        return isDone ? acc + 1 : acc;
      }, 0);

      const ratio = totalHabits > 0 ? completedCount / totalHabits : 0;
      const x = (i / 30) * width;
      const y = padding - ratio * 30; // Pulses "up" based on progress

      points.push(`${x},${y}`);
    }

    return `M ${points.join(" L ")}`;
  }, [habits]);

  return (
    <div className="panel p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Branding Section */}
        <div>
          <h1 className="font-display text-3xl tracking-widest">
            HABIT <span className="text-cyber-cyan">TRACKER</span>
          </h1>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-flicker shadow-neon-green" />
            <span className="text-cyber-green tracking-[0.3em]">
              SYSTEM ACTIVE
            </span>
          </div>
        </div>

        {/* Interaction Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Protocol Toggle Button */}
          <button
            onClick={toggleProtocol}
            className={`flex items-center gap-2 px-3 py-2 border text-[10px] font-mono transition-all rounded
            ${isLight
                ? "bg-cyber-cyan text-black border-cyber-cyan"
                : "border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10"
              }`}
          >
            {isLight ?  <Sun size={12} /> : <Moon size={12} />}
            {isLight ? " Radiance" : " Stealth"}
          </button>

          {/* Habit Input Form */}
          <form onSubmit={submit} className="flex gap-2 items-center">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Initialize new habit..."
              className="input w-64"
            />
            <button type="submit" className="btn-cyan flex items-center gap-2 px-3 py-1">
              <Plus size={14} />
              ADD
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="btn-danger flex items-center gap-2 px-3 py-1.5"
            >
              <Trash2 size={14} />
              CLEAR ALL
            </button>
          </form>
        </div>
      </div>

      {/* Neural Pulse Visualization */}
      <div className="relative h-20 w-full mt-8">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyber-cyan/10" />
        <svg
          viewBox="0 0 1200 80"
          className="w-full h-full text-cyber-cyan"
          preserveAspectRatio="none"
        >
          <path
            d={pulsePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-all duration-700 ease-in-out"
            style={{ filter: "drop-shadow(0 0 8px #00f2ff)" }}
          />
        </svg>
      </div>
    </div>
  );
}