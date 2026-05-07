'use client'

import { X, Key, Eye, EyeOff, Check, AlertCircle, ExternalLink } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function Settings() {
  const { isSettingsOpen, setSettingsOpen, apiKey, setApiKey } = useAppStore()
  const [inputKey, setInputKey] = useState(apiKey || '')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const handleSave = () => {
    setApiKey(inputKey.trim() || null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  const handleClear = () => {
    setInputKey('')
    setApiKey(null)
  }
  
  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-popover border-t border-border rounded-t-3xl z-50"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSettingsOpen(false)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Content */}
            <div className="px-5 pb-8 space-y-6">
              {/* API Key Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">NVIDIA API Key</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Enter your NVIDIA API key to use the models. Get your key from{' '}
                  <a 
                    href="https://build.nvidia.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    build.nvidia.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="nvapi-..."
                    className="w-full px-4 py-3 pr-12 bg-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-secondary/80"
                  >
                    {showKey ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                
                {/* Status indicator */}
                <div className={`flex items-center gap-2 text-sm ${apiKey ? 'text-green-500' : 'text-yellow-500'}`}>
                  {apiKey ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>API key configured</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>API key required to use the app</span>
                    </>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved
                      </>
                    ) : (
                      'Save API Key'
                    )}
                  </motion.button>
                  
                  {apiKey && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClear}
                      className="px-4 py-3 bg-destructive/10 text-destructive rounded-xl font-medium"
                    >
                      Clear
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your API key is stored locally in your browser and never sent to our servers. 
                  It&apos;s only used to communicate directly with the NVIDIA API.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
