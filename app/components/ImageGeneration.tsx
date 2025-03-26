import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ImageIcon, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageGenerationProps } from "../types";

export function ImageGeneration({
  selectedImage,
  generatedImage,
  loading,
  onGenerate,
  userPrompt,
  onPromptChange,
}: ImageGenerationProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col"
    >
      <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Generated Result</p>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-xs">Generating your image...</p>
            </motion.div>
          ) : generatedImage ? (
            <motion.div
              key="generated-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={generatedImage}
                alt="Generated"
                fill
                className="object-contain"
              />
            </motion.div>
          ) : (
            <motion.div
              key="result-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <ImageIcon className="h-6 w-6 text-gray-300 dark:text-gray-700 mb-2" />
              <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
                Your result will appear here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {generatedImage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            className="mt-2 h-8 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs"
            onClick={() => {
              const link = document.createElement("a");
              link.href = generatedImage;
              link.download = "gemini-generated-image.jpg";
              link.click();
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            Download Image
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
} 