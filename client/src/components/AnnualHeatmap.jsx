import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useHabits } from "../context/HabitContext";
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay } from 'date-fns';

const MONTHS = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"];

export default function AnnualHeatmap() {
  const { habits } = useHabits();
  const [open, setOpen] = useState(true);

  // 1. Generate every single day of the current year
  const yearDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfYear(new Date()),
      end: endOfYear(new Date())
    });
  }, []);

  // 2. Logic to calculate color intensity based on real habit data
  const getDayStyles = (date) => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return "bg-cyber-border";

    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Count how many habits were completed on this specific date
    const completedCount = habits.reduce((acc, habit) => {
      const isDone = habit.completions?.some(c => c.date === dateStr && c.completed);
      return isDone ? acc + 1 : acc;
    }, 0);

    const ratio = completedCount / totalHabits;

    // Map ratio to Cyberpunk color levels
    if (ratio === 0) return "bg-cyber-border";
    if (ratio <= 0.25) return "bg-cyber-green/20";
    if (ratio <= 0.5) return "bg-cyber-green/40";
    if (ratio <= 0.75) return "bg-cyber-green/70";
    return "bg-cyber-green shadow-[0_0_8px_#00ff41]"; // Full glow for 100% completion
  };

  return (
    <div className="panel p-6 mb-6">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center">
        <h3 className="font-display text-lg tracking-widest uppercase">ANNUAL CONSISTENCY ENGINE</h3>
        <ChevronDown className={`text-cyber-cyan transition ${open ? "" : "-rotate-90"}`}/>
      </button>
      
      {open && (
        <>
          <div className="overflow-x-auto mt-6">
            {/* The grid now maps through the actual days of the year */}
            <div className="grid grid-flow-col gap-[3px]"
              style={{ gridTemplateRows: `repeat(7, minmax(0,1fr))` }}>
              
              {yearDays.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                return (
                  <div 
                    key={dateKey} 
                    title={`${dateKey}`}
                    className={`w-3 h-3 rounded-sm transition-colors duration-500 ${getDayStyles(day)}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-12 mt-3 text-[10px] text-cyber-muted uppercase tracking-tighter">
            {MONTHS.map((m) => <span key={m} className="text-center">{m.substring(0, 3)}</span>)}
          </div>
        </>
      )}
    </div>
  );
}