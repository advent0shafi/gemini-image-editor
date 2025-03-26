import { motion } from "framer-motion";
import { KeyRound, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiKeyFormProps } from "../types";

export function ApiKeyForm({ onSubmit, error }: ApiKeyFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const apiKey = formData.get('apiKey') as string;
    onSubmit(apiKey);
  };

  return (
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
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <div className="space-y-1">
            <Input
              name="apiKey"
              type="password"
              placeholder="Enter your Gemini API key"
              className={`h-10 bg-gray-50 dark:bg-gray-900 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm ${
                error ? "border-red-500 dark:border-red-500" : ""
              }`}
              required
            />
            {error && (
              <div className="flex items-start text-xs text-red-500 dark:text-red-400 mt-1">
                <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
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
  );
} 