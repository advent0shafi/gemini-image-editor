import { motion } from "framer-motion";

interface TipsProps {
  show: boolean;
}

export function Tips({ show }: TipsProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <div className="container mx-auto max-w-7xl px-3 py-3">
        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <p className="font-medium">Tips for best results:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>For best performance, use the following languages: English, Spanish (Mexico), Japanese, Chinese, Hindi.</li>
            <li>Image generation does not support audio or video inputs.</li>
            <li>If the model outputs text only, try asking for image outputs explicitly (e.g. "generate an image", "provide images as you go along", "update the image").</li>
            <li>If the model stops generating partway through, try again or try a different prompt.</li>
            <li>When generating text for an image, Gemini works best if you first generate the text and then ask for an image with the text.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
} 