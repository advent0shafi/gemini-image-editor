import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-3">
      <div className="container mx-auto max-w-7xl px-3">
        <div className="flex flex-col items-center gap-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs text-center text-gray-400 dark:text-gray-500"
          >
            Powered by Google Gemini • Requires Gemini 2.0 Flash Exp Image Generation model
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
          >
            <a
              href="https://github.com/advent0shafi/gemini-image-editor"
              className="flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-2 w-2 mr-1" />
              Source Code
            </a>
            • Created by{" "}
            <a
              href="https://mohammedshafi.vercel.app/"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mohammed Shafi
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
} 