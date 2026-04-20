import Header from "./components/Header";
import MorningSync from "./components/MorningSync";
import AnnualHeatmap from "./components/AnnualHeatmap";
import MonthlyGrid from "./components/MonthlyGrid";
import MonthlyMetrics from "./components/MonthlyMetrics";
import InspirationFeed from "./components/InspirationFeed";

export default function App() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Header />
      <MorningSync />
      <AnnualHeatmap />
      <MonthlyGrid />
      <MonthlyMetrics />
      <InspirationFeed />
    </div>
  );
}
