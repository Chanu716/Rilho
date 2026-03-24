import { motion } from 'framer-motion';

export default function SplitText({ text, className = "", delay = 0.05 }) {
  const letters = text.split("");
  return (
    <div className={`inline-block whitespace-nowrap ${className}`}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: i * delay, ease: "easeOut" }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}
