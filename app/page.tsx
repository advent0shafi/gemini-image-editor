"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  Camera,
  ImageIcon,
  Loader2,
  KeyRound,
  Upload,
  ArrowRight,
  Download,
  ExternalLink,
  RefreshCw,
  InfoIcon,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import toast, { Toaster } from 'react-hot-toast';
import { editImageWithGemini } from "@/app/actions"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [responseText, setResponseText] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [userPrompt, setUserPrompt] = useState<string>("Hi, This is a picture of me. Can you add a llama next to me?")
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Add a new state variable for the API key
  const [apiKey, setApiKey] = useState<string>("")
  const [apiKeyEntered, setApiKeyEntered] = useState<boolean>(false)
  const [apiKeyError, setApiKeyError] = useState<string>("")

  const [showTips, setShowTips] = useState<boolean>(false)

  const pickImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        toast.error("Image size exceeds 1MB limit. Please choose a smaller image.")
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setGeneratedImage(null)
        setResponseText("")
      }
      reader.readAsDataURL(file)
    }
  }
  const isValidApiKeyFormat = (key: string): boolean => {
    // Gemini API keys typically start with "AI" followed by alphanumeric characters
    return /^AIza[0-9A-Za-z_-]{35}$/.test(key)
  }
  // Modify the generateImage function to use the user-provided API key
  const generateImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first")
      return
    }

    if (!apiKey) {
      toast.error("Please enter your Gemini API key",)
      return
    }

    setLoading(true)
    try {
      // Extract the base64 data from the data URL
      const base64Data = selectedImage.split(",")[1]

      // Call the server action with the user-provided API key
      const result = await editImageWithGemini(apiKey, base64Data, userPrompt)

      if (result.success) {
        if (result.text) {
          setResponseText(result.text)
        }

        if (result.imageData) {
          setGeneratedImage(`data:image/jpeg;base64,${result.imageData}`)
        }

        toast.success("Image generated successfully!")
      } else {
        toast(
          result.error || "Failed to generate image. Please try again.",
          {
            duration: 1000,
          }
        );
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Add a function to handle API key submission
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiKeyError("")

    if (!apiKey.trim()) {
      setApiKeyError("Please enter a valid API key")
      return
    }

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      setApiKeyError("Invalid API key format. Gemini API keys typically start with 'AIza' followed by 35 characters.")
      return
    }

    setApiKeyEntered(true)
    toast.success("Your Gemini API key has been saved for this session.")
  }
  // Add a function to reset the API key
  const resetApiKey = () => {
    setApiKey("")
    setApiKeyEntered(false)
    setApiKeyError("")
  }

  // Reset everything
  const resetAll = () => {
    setSelectedImage(null)
    setGeneratedImage(null)
    setResponseText("")
    setUserPrompt("Hi, This is a picture of me. Can you add a llama next to me?")
  }

  // Toggle tips visibility
  const toggleTips = () => {
    setShowTips(!showTips)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
      <Toaster />
      <AnimatePresence mode="wait">
        {!apiKeyEntered ? (
          <motion.div
            key="api-key-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <KeyRound className="h-8 w-8 mx-auto mb-3 text-gray-900 dark:text-white" />
                </motion.div>
                <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-1">Editify Image Editor</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your API key to get started</p>
              </motion.div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onSubmit={handleApiKeySubmit}
                className="space-y-3"
              >
                 <div className="space-y-1">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className={`h-10 bg-gray-50 dark:bg-gray-900 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm ${
                        apiKeyError ? "border-red-500 dark:border-red-500" : ""
                      }`}
                      required
                    />
                    {apiKeyError && (
                      <div className="flex items-start text-xs text-red-500 dark:text-red-400 mt-1">
                        <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{apiKeyError}</span>
                      </div>
                    )}
                  </div>
                <Button
                  type="submit"
                  className="w-full h-10 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black text-sm"
                >
                  Continue
                </Button>
              </motion.form>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 space-y-3"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">Don't have an API key?</p>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-xs text-gray-900 dark:text-white hover:underline"
                >
                  Get one from Google AI Studio
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-3">
                    <h3 className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                      How to get a valid API key:
                    </h3>
                    <ol className="text-xs text-blue-700 dark:text-blue-400 list-decimal list-inside space-y-0.5">
                      <li>
                        Go to{" "}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Google AI Studio API Keys
                        </a>
                      </li>
                      <li>Sign in with your Google account</li>
                      <li>Click "Create API key"</li>
                      <li>Copy the generated key (starts with "AIza")</li>
                      <li>Paste the key in the input field above</li>
                    </ol>
                  </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col"
          >
            <header className="border-b border-gray-100 dark:border-gray-800">
              <div className="container mx-auto max-w-7xl px-3 py-3 flex justify-between items-center">
                <motion.h1
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="md:text-lg font-medium text-gray-900 dark:text-white text-sm"
                >
               < span className="hidden md:block">   Editify Image Editor</span>
               <span className="block md:hidden">Editify</span>
                </motion.h1>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex items-center gap-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTips}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs px-2"
                  >
                    <InfoIcon className="h-3 w-3 mr-1" />
                    Tips
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAll}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs px-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    New
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetApiKey}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs px-2"
                  >
                    <KeyRound className="h-3 w-3 mr-1" />
                    API Key
                  </Button>
                </motion.div>
              </div>
            </header>

            {showTips && (
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
            )}

            <div className="flex-1 container mx-auto max-w-7xl px-3 py-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Image Upload and Generation Area */}
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
                              src={selectedImage || "/placeholder.svg"}
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
                          toast.error("Camera access is not available in web version. Please use the gallery option.")
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
                              src={generatedImage || "/placeholder.svg"}
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
                            const link = document.createElement("a")
                            link.href = generatedImage
                            link.download = "gemini-generated-image.jpg"
                            link.click()
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Image
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Prompt and Response Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Edit Instructions</p>
                    <div className="flex-1 flex flex-col">
                      <Textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Describe what you want to do with the image..."
                        className="flex-1 min-h-[100px] resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
                      />

                      <Button
                        className="w-full mt-2 h-10 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black text-xs"
                        onClick={generateImage}
                        disabled={!selectedImage || loading}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-1"
                          >
                            <Loader2 className="h-3 w-3" />
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ x: 5 }} className="flex items-center">
                            Generate
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </motion.div>
                        )}
                      </Button>
                     
                    </div>

                  </motion.div>

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
                </div>
              </div>
            </div>

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
                    <a href="https://github.com/advent0shafi/gemini-image-editor" className="flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-2 w-2 mr-1" />
                      Source Code
                    </a>
                    • Created by <a href="https://mohammedshafi.vercel.app/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors" target="_blank" rel="noopener noreferrer">Mohammed Shafi</a> 
                  </motion.div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
