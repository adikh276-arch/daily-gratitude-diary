import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ScreenIntro from "@/components/ScreenIntro";
import ScreenGratitude from "@/components/ScreenGratitude";
import ScreenReflection from "@/components/ScreenReflection";
import ScreenClosing from "@/components/ScreenClosing";
import ScreenPastEntries from "@/components/ScreenPastEntries";

interface GratitudeEntry {
  grateful: string;
  reason: string;
}

interface SavedEntry {
  date: string;
  gratitudes: GratitudeEntry[];
  feeling: string;
}

type Screen = "intro" | "gratitude" | "reflection" | "closing" | "past";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentGratitudes, setCurrentGratitudes] = useState<GratitudeEntry[]>([]);
  const [pastEntries, setPastEntries] = useState<SavedEntry[]>(() => {
    try {
      const saved = localStorage.getItem("gratitude-entries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveEntry = (feeling: string) => {
    const entry: SavedEntry = {
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      gratitudes: currentGratitudes.filter((e) => e.grateful.trim()),
      feeling,
    };
    const updated = [entry, ...pastEntries];
    setPastEntries(updated);
    localStorage.setItem("gratitude-entries", JSON.stringify(updated));
    setScreen("closing");
  };

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {screen === "intro" && (
          <ScreenIntro key="intro" onStart={() => setScreen("gratitude")} />
        )}
        {screen === "gratitude" && (
          <ScreenGratitude
            key="gratitude"
            onContinue={(entries) => {
              setCurrentGratitudes(entries);
              setScreen("reflection");
            }}
            onBack={() => setScreen("intro")}
          />
        )}
        {screen === "reflection" && (
          <ScreenReflection
            key="reflection"
            onSave={saveEntry}
            onBack={() => setScreen("gratitude")}
          />
        )}
        {screen === "closing" && (
          <ScreenClosing
            key="closing"
            onViewPast={() => setScreen("past")}
            onDone={() => setScreen("intro")}
          />
        )}
        {screen === "past" && (
          <ScreenPastEntries
            key="past"
            entries={pastEntries}
            onBack={() => setScreen("closing")}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
