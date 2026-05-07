'use client'

import { Key, Eye, EyeOff, Sparkles, ExternalLink, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function ApiKeyPrompt() {
  const { setApiKey } = useAppStore()
  const [inputKey, setInputKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Shrpo AI</h1>
          <p className="text-muted-foreground text-sm mt-2">Powered by NVIDIA</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="font-medium">Enter your NVIDIA API Key</h2>
            </div>
            
            <p className="text-sm text-muted-foreground">
              To get started, you need an NVIDIA API key. Get one for free at{' '}
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
                autoFocus
                className="w-full px-4 py-4 pr-12 bg-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-secondary/80"
              >
                {showKey ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={!inputKey.trim()}
            className="w-full px-4 py-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
        
        {/* Security note */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            🔒 Your API key is stored securely in your browser&apos;s local storage. 
            It is never sent to our servers and only used to communicate directly with the NVIDIA API.
          </p>
        </div>
        
        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { title: '50+ Models', desc: 'Access cutting-edge AI' },
            { title: 'Streaming', desc: 'Real-time responses' },
            { title: 'RTL Support', desc: 'Arabic & Hebrew' },
            { title: 'Image Analysis', desc: 'Vision models' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-3 bg-card border border-border rounded-xl text-center"
            >
              <h3 className="font-medium text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
