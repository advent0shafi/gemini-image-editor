import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, ImageIcon, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ImageUploadProps } from "../types";

export function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-col"
    >
      <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Original Image</p>
      <div
        onClick={pickImage}
        className={`relative w-full aspect-video rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
          selectedImage
            ? "bg-gray-50 dark:bg-gray-900"
            : "bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {selectedImage ? (
            <motion.div
              key="selected-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={selectedImage}
                alt="Selected"
                fill
                className="object-contain"
              />
            </motion.div>
          ) : (
            <motion.div
              key="upload-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full p-4"
            >
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-xs text-center">Click to upload</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs text-center mt-0.5">Max size: 1MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          className="flex-1 h-8 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs"
          onClick={pickImage}
        >
          <ImageIcon className="h-3 w-3 mr-1" />
          Gallery
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-8 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs"
          onClick={() => {
            toast.error("Camera access is not available in web version. Please use the gallery option.");
          }}
        >
          <Camera className="h-3 w-3 mr-1" />
          Camera
        </Button>
      </div>
      <div className="mt-1 text-center">
        <a
          href="https://www.google.com/search?q=image+compressor+online"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline flex items-center justify-center"
        >
          <ExternalLink className="h-2 w-2 mr-1" />
          Find an image compressor online
        </a>
        <p className="text-xs text-gray-400 mt-0.5">Smaller images process faster</p>
      </div>
    </motion.div>
  );
} 