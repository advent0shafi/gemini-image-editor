"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { ApiKeyForm } from "./components/ApiKeyForm";
import { Header } from "./components/Header";
import { Tips } from "./components/Tips";
import { ImageUpload } from "./components/ImageUpload";
import { ImageGeneration } from "./components/ImageGeneration";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { Footer } from "./components/Footer";
import { useApiKey } from "./hooks/useApiKey";
import { useImageGeneration } from "./hooks/useImageGeneration";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState<string>(
    "Hi, This is a picture of me. Can you add a llama next to me?"
  );
  const [showTips, setShowTips] = useState<boolean>(false);

  const {
    apiKey,
    setApiKey,
    apiKeyEntered,
    apiKeyError,
    handleApiKeySubmit,
    resetApiKey,
  } = useApiKey();

  const {
    selectedImage,
    generatedImage,
    responseText,
    loading,
    handleImageUpload,
    generateImage,
    resetAll,
  } = useImageGeneration(apiKey);

  const handleGenerate = () => {
    generateImage(userPrompt);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
      <Toaster />
      <AnimatePresence mode="wait">
        {!apiKeyEntered ? (
          <ApiKeyForm onSubmit={handleApiKeySubmit} error={apiKeyError} />
        ) : (
          <div className="min-h-screen flex flex-col">
            <Header
              onToggleTips={() => setShowTips(!showTips)}
              onResetAll={resetAll}
              onResetApiKey={resetApiKey}
            />

            <Tips show={showTips} />

            <div className="flex-1 container mx-auto max-w-7xl px-3 py-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <ImageUpload
                    onImageSelect={handleImageUpload}
                    selectedImage={selectedImage}
                  />

                  <ImageGeneration
                    selectedImage={selectedImage}
                    generatedImage={generatedImage}
                    loading={loading}
                    onGenerate={handleGenerate}
                    userPrompt={userPrompt}
                    onPromptChange={setUserPrompt}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
                  <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}className="flex flex-col">
                    <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">
                      Edit Instructions
                    </p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex-1 flex flex-col "
                    >
                      <Textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Describe what you want to do with the image..."
                        className="flex-1 min-h-[100px] resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
                      />

                      <Button
                        className="w-full mt-2 h-10 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black text-xs"
                        onClick={handleGenerate}
                        disabled={!selectedImage || loading}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="mr-1"
                          >
                            <Loader2 className="h-3 w-3" />
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center"
                          >
                            Generate
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <ResponseDisplay responseText={responseText} />
                </div>
              </div>
            </div>

            <Footer />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
