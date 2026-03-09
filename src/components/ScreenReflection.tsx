import { useState } from "react";
import { motion } from "framer-motion";
import cherryBlossom from "@/assets/cherry-blossom.png";
import { useTranslation } from "react-i18next";

interface ScreenReflectionProps {
  onSave: (feeling: string) => void;
  onBack: () => void;
}

const ScreenReflection = ({ onSave, onBack }: ScreenReflectionProps) => {
  const { t } = useTranslation();
  const [feeling, setFeeling] = useState("");

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
        {t('reflection_title')}
      </h1>

      <div className="space-y-3 mb-8 max-w-sm">
        <p className="text-foreground leading-[1.7]">
          {t('reflection_text')}
        </p>
      </div>

      <div className="w-full max-w-sm mb-10">
        <input
          type="text"
          placeholder={t('placeholder_feeling')}
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          className="w-full h-[54px] bg-card rounded-[30px] px-6 text-center text-base font-body text-input-text placeholder:text-placeholder border-none outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onSave(feeling)}
        className="w-full max-w-sm h-[54px] bg-primary text-primary-foreground rounded-[30px] font-heading font-medium text-base shadow-[0_4px_20px_rgba(195,142,180,0.25)] active:bg-primary-pressed transition-colors duration-150"
      >
        {t('save_entry')}
      </motion.button>
    </motion.div>
  );
};

export default ScreenReflection;
