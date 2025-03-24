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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { editImageWithGemini } from "@/app/actions"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [responseText, setResponseText] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [userPrompt, setUserPrompt] = useState<string>("Hi, This is a picture of me. Can you add a llama next to me?")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Add a new state variable for the API key
  const [apiKey, setApiKey] = useState<string>("")
  const [apiKeyEntered, setApiKeyEntered] = useState<boolean>(false)

  const pickImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setGeneratedImage(null)
        setResponseText("")
      }
      reader.readAsDataURL(file)
    }
  }

  // Modify the generateImage function to use the user-provided API key
  const generateImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      })
      return
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      })
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

        toast({
          title: "Success",
          description: "Image generated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate image. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add a function to handle API key submission
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      setApiKeyEntered(true)
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved for this session.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      })
    }
  }

  // Add a function to reset the API key
  const resetApiKey = () => {
    setApiKey("")
    setApiKeyEntered(false)
  }

  // Reset everything
  const resetAll = () => {
    setSelectedImage(null)
    setGeneratedImage(null)
    setResponseText("")
    setUserPrompt("Hi, This is a picture of me. Can you add a llama next to me?")
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
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
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <KeyRound className="h-10 w-10 mx-auto mb-4 text-gray-900 dark:text-white" />
                </motion.div>
                <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Gemini Image Editor</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your API key to get started</p>
              </motion.div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onSubmit={handleApiKeySubmit}
                className="space-y-4"
              >
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black"
                >
                  Continue
                </Button>
              </motion.form>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 space-y-4"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Don't have an API key?</p>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-sm text-gray-900 dark:text-white hover:underline"
                >
                  Get one from Google AI Studio
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                  You need to enable the "Gemini 2.0 Flash Exp Image Generation" model
                </p>
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
              <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
                <motion.h1
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-xl font-medium text-gray-900 dark:text-white"
                >
                  Editify Image Editor
                </motion.h1>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAll}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetApiKey}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change API Key
                  </Button>
                </motion.div>
              </div>
            </header>

            <div className="flex-1 container mx-auto max-w-7xl px-4 py-6">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Image Upload and Generation Area */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Original Image</p>
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
                            className="flex flex-col items-center justify-center h-full p-6"
                          >
                            <Upload className="h-8 w-8 text-gray-400 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">Click to upload</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-10 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                        onClick={pickImage}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Gallery
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-10 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                        onClick={() => {
                          toast({
                            title: "Camera Access",
                            description:
                              "Camera access is not available in web version. Please use the gallery option.",
                          })
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Generated Result</p>
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
                            <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Generating your image...</p>
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
                            <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-700 mb-3" />
                            <p className="text-gray-400 dark:text-gray-500 text-sm text-center">
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
                          className="mt-3 h-10 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.href = generatedImage
                            link.download = "gemini-generated-image.jpg"
                            link.click()
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Image
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Prompt and Response Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Edit Instructions</p>
                    <div className="flex-1 flex flex-col">
                      <Textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Describe what you want to do with the image..."
                        className="flex-1 min-h-[120px] resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />

                      <Button
                        className="w-full mt-3 h-12 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black"
                        onClick={generateImage}
                        disabled={!selectedImage || loading}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <Loader2 className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ x: 5 }} className="flex items-center">
                            Generate
                            <ArrowRight className="h-4 w-4 ml-2" />
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">AI Response</p>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 min-h-[120px] overflow-y-auto">
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

            <footer className="border-t border-gray-100 dark:border-gray-800 py-4">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-center gap-2">
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
                    className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500"
                  >
                    <a href="https://github.com/advent0shafi/gemini-image-editor" className="flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Source Code
                    </a>
                    • Created by Mohammed Shafi 
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

