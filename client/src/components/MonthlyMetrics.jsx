import { useHabits } from "../context/HabitContext";

export default function MonthlyMetrics() {
  const { habits } = useHabits();
  return (
    <section className="mb-6">
      <h3 className="label mb-3">MONTHLY METRICS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {habits.map((h) => (
          <div key={h.id} className="panel p-4">
            <div className="flex justify-between text-xs">
              <span className="uppercase tracking-wider">{h.name}</span>
              <span className="text-cyber-cyan">{h.monthlyPct}%</span>
            </div>
            <div className="h-1 mt-3 bg-cyber-border rounded">
              <div className="h-full bg-cyber-cyan shadow-neon rounded"
                style={{ width: `${h.monthlyPct}%` }}/>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
