import { useHabits } from "../context/HabitContext";
import { ShieldAlert } from "lucide-react"; // Import the icon for the shield

const isoDate = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export default function MonthlyGrid() {
  const { habits, toggle } = useHabits();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayN = today.getDate();

  return (
    <div className="panel p-4 mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 bg-cyber-panel text-left p-3 label min-w-[180px] z-10">
              HABIT_NAME
            </th>
            {days.map((d) => (
              <th
                key={d}
                className={`p-2 ${d === todayN ? "text-cyber-cyan font-bold" : "text-cyber-muted"}`}
              >
                {String(d).padStart(2, "0")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => (
            <tr
              key={h.id}
              className="border-t border-cyber-border/50 hover:bg-white/5 transition-colors"
            >
              <td className="sticky left-0 bg-cyber-panel p-3 text-cyber-cyan uppercase font-bold z-10">
                <div className="flex flex-col">
                  <span>{h.name}</span>
                  <span className="text-[9px] text-cyber-muted font-mono tracking-tighter">
                    STRK: {h.currentStreak || 0}D
                  </span>
                </div>
              </td>
              {days.map((d) => {
                const date = isoDate(year, month, d);

                // DATA CHECK: Correctly using 'h' inside the habits map
                const completion = h.completions?.find((c) => c.date === date);
                const isDone = completion?.completed;
                const isShielded = completion?.shielded;

                // RESTRICTION LOGIC
                const isCurrent = d === todayN;
                const isPrev = d === todayN - 1;
                const future = d > todayN;
                const locked = !isCurrent && !isPrev && !future; // Older than yesterday

                return (
                  <td key={d} className="p-2 text-center">
                    <button
                      disabled={future || locked} // Lock both future AND old days
                      onClick={() => toggle(h.id, date)}
                      data-checked={isDone}
                      data-shielded={isShielded}
                      data-today={isCurrent}
                      className={`cyber-checkbox mx-auto flex items-center justify-center ${
                        future ? "opacity-10 cursor-not-allowed" : ""
                      } ${
                        locked ? "opacity-40 cursor-not-allowed grayscale" : ""
                      }`}
                      aria-label={`${h.name} ${date}`}
                    >
                      {/* Checkmark for completed days */}
                      {isDone && (
                        <span className="text-cyber-green text-[10px] font-bold">
                          ✓
                        </span>
                      )}

                      {/* Shield icon for "Life Happens" days */}
                      {isShielded && (
                        <ShieldAlert
                          size={10}
                          className="text-[#ffb000] shield-glow"
                        />
                      )}

                      {/* Show a tiny 'x' indicator for locked, empty days */}
                      {locked && !isDone && !isShielded && (
                        <span className="text-[8px] text-cyber-muted opacity-30">
                          x
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
