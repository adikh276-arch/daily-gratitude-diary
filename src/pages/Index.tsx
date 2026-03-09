import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ScreenIntro from "@/components/ScreenIntro";
import ScreenGratitude from "@/components/ScreenGratitude";
import ScreenReflection from "@/components/ScreenReflection";
import ScreenClosing from "@/components/ScreenClosing";
import ScreenPastEntries from "@/components/ScreenPastEntries";
import { dbRequest } from "@/lib/db";

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
  const [pastEntries, setPastEntries] = useState<SavedEntry[]>([]);
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchEntries = async () => {
      if (!userId) return;
      try {
        const rows = await dbRequest<any>(
          "SELECT date, gratitudes, feeling FROM gratitude_entries WHERE user_id = $1 ORDER BY created_at DESC",
          [userId]
        );
        if (rows && Array.isArray(rows)) {
          const formatted = rows.map(row => ({
            ...row,
            gratitudes: typeof row.gratitudes === 'string' ? JSON.parse(row.gratitudes) : row.gratitudes
          }));
          setPastEntries(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch entries:", err);
      }
    };
    fetchEntries();
  }, [userId]);

  const saveEntry = async (feeling: string) => {
    const validGratitudes = currentGratitudes.filter((e) => e.grateful.trim());
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const entry: SavedEntry = {
      date: dateStr,
      gratitudes: validGratitudes,
      feeling,
    };

    if (userId) {
      try {
        await dbRequest(
          "INSERT INTO gratitude_entries (user_id, date, feeling, gratitudes) VALUES ($1, $2, $3, $4)",
          [userId, dateStr, feeling, JSON.stringify(validGratitudes)]
        );
      } catch (err) {
        console.error("Failed to save entry:", err);
      }
    }

    setPastEntries([entry, ...pastEntries]);
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
