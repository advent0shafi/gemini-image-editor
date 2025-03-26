import { motion } from "framer-motion";
import { InfoIcon, RefreshCw, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleTips: () => void;
  onResetAll: () => void;
  onResetApiKey: () => void;
}

export function Header({ onToggleTips, onResetAll, onResetApiKey }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto max-w-7xl px-3 py-3 flex justify-between items-center">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="md:text-lg font-medium text-gray-900 dark:text-white text-sm"
        >
          <span className="hidden md:block">Editify Image Editor</span>
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
            onClick={onToggleTips}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs px-2"
          >
            <InfoIcon className="h-3 w-3 mr-1" />
            Tips
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs px-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            New
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetApiKey}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs px-2"
          >
            <KeyRound className="h-3 w-3 mr-1" />
            Logout
          </Button>
        </motion.div>
      </div>
    </header>
  );
} 