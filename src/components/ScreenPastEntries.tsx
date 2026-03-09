import { motion } from "framer-motion";
import cherryBlossom from "@/assets/cherry-blossom.png";
import { useTranslation } from "react-i18next";

interface PastEntry {
  date: string;
  gratitudes: { grateful: string; reason: string }[];
  feeling: string;
}

interface ScreenPastEntriesProps {
  entries: PastEntry[];
  onBack: () => void;
}

const ScreenPastEntries = ({ entries, onBack }: ScreenPastEntriesProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen px-5 py-10 text-center"
    >
      <img src={cherryBlossom} alt="Cherry blossom" className="w-28 h-28 rounded-full object-cover mb-6" />

      <h1 className="font-heading text-[22px] font-medium text-foreground mb-8">
        {t('past_entries_title')}
      </h1>

      {entries.length === 0 ? (
        <p className="text-muted-foreground leading-[1.7]">
          {t('no_entries')}
        </p>
      ) : (
        <div className="w-full max-w-sm space-y-4 mb-10">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-5 text-left space-y-2"
            >
              <p className="text-muted-foreground text-sm text-center">{entry.date}</p>
              {entry.gratitudes.map((g, j) => (
                <div key={j}>
                  <p className="text-foreground text-[15px]">
                    🌿 {g.grateful}
                  </p>
                  {g.reason && (
                    <p className="text-muted-foreground text-sm ml-6">
                      {g.reason}
                    </p>
                  )}
                </div>
              ))}
              {entry.feeling && (
                <p className="text-muted-foreground text-sm italic pt-1 text-center">
                  {t('feeling_label')}{entry.feeling}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onBack}
        className="w-full max-w-sm h-[54px] bg-primary text-primary-foreground rounded-[30px] font-heading font-medium text-base shadow-[0_4px_20px_rgba(195,142,180,0.25)] active:bg-primary-pressed transition-colors duration-150"
      >
        {t('back')}
      </motion.button>
    </motion.div>
  );
};

export default ScreenPastEntries;
