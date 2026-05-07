'use client'

import { Menu, Settings, ChevronDown } from 'lucide-react'
import { useAppStore, NVIDIA_MODELS } from '@/lib/store'
import { motion } from 'framer-motion'

export function Header() {
  const { 
    selectedModel, 
    setSidebarOpen, 
    setModelSelectorOpen, 
    setSettingsOpen,
    isModelSelectorOpen 
  } = useAppStore()
  
  const currentModel = NVIDIA_MODELS.find(m => m.id === selectedModel)
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary/80 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </motion.button>
        
        {/* Model Selector */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setModelSelectorOpen(!isModelSelectorOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
        >
          <span className="text-sm font-medium gradient-text">
            {currentModel?.name || 'Select Model'}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
        </motion.button>
        
        {/* Settings Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSettingsOpen(true)}
          className="p-2 -mr-2 rounded-full hover:bg-secondary/80 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>
    </header>
  )
}
