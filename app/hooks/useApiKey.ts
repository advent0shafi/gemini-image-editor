import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyEntered, setApiKeyEntered] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string>("");

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setApiKeyEntered(true);
    }
  }, []);

  const isValidApiKeyFormat = (key: string): boolean => {
    return /^AIza[0-9A-Za-z_-]{35}$/.test(key);
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKeyError("");

    if (!key.trim()) {
      setApiKeyError("Please enter a valid API key");
      return;
    }

    if (!isValidApiKeyFormat(key)) {
      setApiKeyError("Invalid API key format. Gemini API keys typically start with 'AIza' followed by 35 characters.");
      return;
    }

    localStorage.setItem('geminiApiKey', key);
    setApiKeyEntered(true);
    toast.success("Your Gemini API key has been saved for this session and browser.");
  };

  const resetApiKey = () => {
    setApiKey("");
    setApiKeyEntered(false);
    setApiKeyError("");
    localStorage.removeItem('geminiApiKey');
  };

  return {
    apiKey,
    setApiKey,
    apiKeyEntered,
    apiKeyError,
    handleApiKeySubmit,
    resetApiKey
  };
}; 