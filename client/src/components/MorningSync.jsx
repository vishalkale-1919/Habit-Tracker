import { Shield } from "lucide-react";
import { useClock } from "../hooks/useClock";
import { useHabits } from "../context/HabitContext";

export default function MorningSync() {
  const now = useClock();
  const { meta, habits } = useHabits();
  const shields = habits.reduce((a, h) => a + (h.shields ?? 0), 0);

  return (
    <div className="panel p-6 mb-6 border-l-4 border-l-cyber-cyan">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-flicker"/>
          <span className="label">MORNING_SYNC</span>
        </div>
        <span className="font-mono text-cyber-cyan text-xl">
          {now.toLocaleTimeString("en-GB")}
        </span>
      </div>
      <h2 className="font-display text-2xl mt-3 tracking-wider">INITIALIZE DAILY PROTOCOL</h2>
      <p className="text-cyber-muted mt-1">
        Detected {habits.length} objectives for today. Awaiting execution.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-end">
        <div>
          <div className="label">OBJECTIVES_DUE</div>
          <div className="font-display text-4xl mt-1">{meta.objectivesDue}</div>
        </div>
        <div>
          <div className="label">STREAK_SHIELDS</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-display text-4xl text-cyber-amber">{shields}</span>
            <Shield className="text-cyber-cyan" size={20}/>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs">
            <span className="label">SYNC_EFFICIENCY</span>
            <span className="text-cyber-cyan">{meta.syncEfficiency}%</span>
          </div>
          <div className="h-1.5 mt-2 bg-cyber-border rounded">
            <div className="h-full bg-cyber-cyan shadow-neon rounded transition-all"
              style={{ width: `${meta.syncEfficiency}%` }}/>
          </div>
        </div>
      </div>
    </div>
  );
}
