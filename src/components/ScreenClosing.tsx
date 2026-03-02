import { motion } from "framer-motion";

interface ScreenClosingProps {
  onViewPast: () => void;
  onDone: () => void;
}

const ScreenClosing = ({ onViewPast, onDone }: ScreenClosingProps) => {
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
        You Took a Moment
      </h1>

      <div className="space-y-5 mb-12 max-w-sm">
        <p className="text-foreground leading-[1.7]">
          Taking time to reflect is an act of care.
        </p>
        <p className="text-foreground leading-[1.7]">
          You can return to this space anytime.
        </p>
        <p className="text-muted-foreground leading-[1.7] italic">
          Even small gratitude counts.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={onViewPast}
          className="w-full h-[54px] bg-transparent border-2 border-primary text-primary rounded-[30px] font-heading font-medium text-base transition-colors duration-150"
        >
          View Past Entries
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={onDone}
          className="w-full h-[54px] bg-primary text-primary-foreground rounded-[30px] font-heading font-medium text-base shadow-[0_4px_20px_rgba(195,142,180,0.25)] active:bg-primary-pressed transition-colors duration-150"
        >
          Done
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScreenClosing;
