import { useState } from "react";
import { motion } from "framer-motion";
import cherryBlossom from "@/assets/cherry-blossom.png";
import { useTranslation } from "react-i18next";

interface GratitudeEntry {
  grateful: string;
  reason: string;
}

interface ScreenGratitudeProps {
  onContinue: (entries: GratitudeEntry[]) => void;
  onBack: () => void;
}

const ScreenGratitude = ({ onContinue, onBack }: ScreenGratitudeProps) => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<GratitudeEntry[]>([{ grateful: "", reason: "" }]);

  const updateEntry = (index: number, field: keyof GratitudeEntry, value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const addAnother = () => {
    setEntries([...entries, { grateful: "", reason: "" }]);
  };

  const canContinue = entries.some((e) => e.grateful.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen px-5 py-10 text-center"
    >
      <img src={cherryBlossom} alt="Cherry blossom" className="w-28 h-28 rounded-full object-cover mb-6" />

      <h1 className="font-heading text-[22px] font-medium text-foreground mb-3">
        {t('grateful_title')}
      </h1>

      <div className="space-y-3 mb-8 max-w-sm">
        <p className="text-foreground leading-[1.7]">{t('grateful_step_1')}</p>
        <p className="text-foreground leading-[1.7]">
          {t('grateful_step_2')}
        </p>
        <p className="text-muted-foreground leading-[1.7]">{t('grateful_step_3')}</p>
      </div>

      <div className="w-full max-w-sm space-y-6 mb-10">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder={t('placeholder_grateful')}
              value={entry.grateful}
              onChange={(e) => updateEntry(i, "grateful", e.target.value)}
              className="w-full h-[54px] bg-card rounded-[30px] px-6 text-center text-base font-body text-input-text placeholder:text-placeholder border-none outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
            />
            <input
              type="text"
              placeholder={t('placeholder_reason')}
              value={entry.reason}
              onChange={(e) => updateEntry(i, "reason", e.target.value)}
              className="w-full h-[54px] bg-card rounded-[30px] px-6 text-center text-base font-body text-input-text placeholder:text-placeholder border-none outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
            />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-sm space-y-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={addAnother}
          className="w-full h-[54px] bg-transparent border-2 border-primary text-primary rounded-[30px] font-heading font-medium text-base transition-colors duration-150"
        >
          {t('add_another')}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={() => canContinue && onContinue(entries)}
          className={`w-full h-[54px] rounded-[30px] font-heading font-medium text-base shadow-[0_4px_20px_rgba(195,142,180,0.25)] transition-all duration-150 ${canContinue
              ? "bg-primary text-primary-foreground active:bg-primary-pressed"
              : "bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
            }`}
        >
          {t('continue')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScreenGratitude;
