import { motion } from "framer-motion";
import cherryBlossom from "@/assets/cherry-blossom.png";
import { useTranslation } from "react-i18next";

interface ScreenIntroProps {
  onStart: () => void;
}

const ScreenIntro = ({ onStart }: ScreenIntroProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-5 py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6"
      >
        <img src={cherryBlossom} alt="Cherry blossom" className="w-36 h-36 rounded-full object-cover mx-auto" />
      </motion.div>

      <h1 className="font-heading text-[22px] font-medium text-foreground mb-3">
        {t('app_title')}
      </h1>

      <p className="text-muted-foreground text-base mb-8">
        {t('app_subtitle')}
      </p>

      <div className="space-y-5 mb-12 max-w-sm">
        <p className="text-foreground leading-[1.7]">
          {t('intro_text_1')}
        </p>
        <p className="text-foreground leading-[1.7]">
          {t('intro_text_2')}
        </p>
        <p className="text-foreground leading-[1.7]">
          {t('intro_text_3')}
        </p>
        <p className="text-muted-foreground leading-[1.7] italic">
          {t('intro_text_italic')}
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onStart}
        className="w-full max-w-sm h-[54px] bg-primary text-primary-foreground rounded-[30px] font-heading font-medium text-base shadow-[0_4px_20px_rgba(195,142,180,0.25)] active:bg-primary-pressed transition-colors duration-150"
      >
        {t('start_button')}
      </motion.button>
    </motion.div>
  );
};

export default ScreenIntro;
