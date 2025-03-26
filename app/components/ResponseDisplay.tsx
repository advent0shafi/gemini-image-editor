import { motion, AnimatePresence } from "framer-motion";
import { ResponseDisplayProps } from "../types";

export function ResponseDisplay({ responseText }: ResponseDisplayProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col"
    >
      <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">AI Response</p>
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-xs text-gray-700 dark:text-gray-300 min-h-[100px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {responseText ? (
            <motion.div
              key="response-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {responseText}
            </motion.div>
          ) : (
            <motion.div
              key="response-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 dark:text-gray-500 h-full flex items-center justify-center"
            >
              AI explanation will appear here after generation
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 