import { useEffect, useState, useCallback } from "react";
import { useHabits } from "../context/HabitContext";
import SystemDiagnostic from "./SystemDiagnostic";

export default function InspirationFeed() {
  const { error, refresh: refreshHabits } = useHabits();
  const [quote, setQuote] = useState("INITIALIZING_NEURAL_LINK...");
  const [loading, setLoading] = useState(true);

  // 1. Function to fetch a live quote from an external API
  const fetchLiveQuote = useCallback(async () => {
    setLoading(true);
    try {
      // Fetching from Adviceslip API for a "Neural/Direct" vibe
      const response = await fetch("https://api.adviceslip.com/advice");
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // We set the quote and convert to uppercase for the terminal look
      setQuote(data.slip.advice.toUpperCase());
    } catch (err) {
      console.error("Neural Feed Sync Failed:", err);
      setQuote("CONNECTION_STABILITY_LOW: USE_LOCAL_PROTOCOLS");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial fetch and auto-rotation every 30 seconds
  useEffect(() => {
    fetchLiveQuote();
    
    const t = setInterval(() => {
      fetchLiveQuote();
    }, 30000); // Rotates every 30 seconds to avoid API rate limits

    return () => clearInterval(t);
  }, [fetchLiveQuote]);

  // 3. Combined refresh handler
  const handleResync = () => {
    fetchLiveQuote();
    refreshHabits();
  };

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="label">NEURAL_INSPIRATION_FEED</span>
        <span className={`w-2 h-2 rounded-full bg-cyber-cyan ${loading ? 'animate-pulse' : 'animate-flicker'}`}/>
      </div>

      {error ? (
        <SystemDiagnostic error={error} onRetry={handleResync} />
      ) : (
        <div className="min-h-[60px] flex items-center justify-center">
          <p className={`text-center italic text-cyber-cyan/90 transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
            "{quote}"
          </p>
        </div>
      )}

      <div className="text-center mt-4">
        <button 
          onClick={handleResync} 
          disabled={loading}
          className="btn-ghost disabled:opacity-50"
        >
          {loading ? "SYNCING..." : "RE-SYNC_FEED"}
        </button>
      </div>
    </div>
  );
}