import { motion } from 'framer-motion';

export default function Bounce({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay
      }}
    >
      {children}
    </motion.div>
  );
}
