import { motion } from "framer-motion";

interface ScreenIntroProps {
  onStart: () => void;
}

const ScreenIntro = ({ onStart }: ScreenIntroProps) => {
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
        className="text-5xl mb-6"
      >
        🌸
      </motion.div>

      <h1 className="font-heading text-[22px] font-medium text-foreground mb-3">
        Daily Gratitude Diary
      </h1>

      <p className="text-muted-foreground text-base mb-8">
        Noticing Small Good Things
      </p>

      <div className="space-y-5 mb-12 max-w-sm">
        <p className="text-foreground leading-[1.7]">
          Gratitude does not mean ignoring difficult emotions.
        </p>
        <p className="text-foreground leading-[1.7]">
          It simply means gently noticing moments — big or small — that feel steady, comforting, or meaningful.
        </p>
        <p className="text-foreground leading-[1.7]">
          Some days it may be something very small.
        </p>
        <p className="text-muted-foreground leading-[1.7] italic">
          That is enough.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onStart}
        className="w-full max-w-sm h-[54px] bg-primary text-primary-foreground rounded-[30px] font-heading font-medium text-base shadow-[0_4px_20px_rgba(195,142,180,0.25)] active:bg-primary-pressed transition-colors duration-150"
      >
        Start Today's Entry
      </motion.button>
    </motion.div>
  );
};

export default ScreenIntro;
