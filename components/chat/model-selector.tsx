'use client'

import { Check, X, Search } from 'lucide-react'
import { useAppStore, NVIDIA_MODELS } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'

export function ModelSelector() {
  const { isModelSelectorOpen, setModelSelectorOpen, selectedModel, setSelectedModel } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  
  const groupedModels = useMemo(() => {
    const filtered = NVIDIA_MODELS.filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return filtered.reduce((groups, model) => {
      if (!groups[model.category]) groups[model.category] = []
      groups[model.category].push(model)
      return groups
    }, {} as Record<string, typeof NVIDIA_MODELS>)
  }, [searchQuery])
  
  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId)
    setModelSelectorOpen(false)
    setSearchQuery('')
  }
  
  return (
    <AnimatePresence>
      {isModelSelectorOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setModelSelectorOpen(false)
              setSearchQuery('')
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-popover border-t border-border rounded-t-3xl z-50 flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-semibold">Select Model</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setModelSelectorOpen(false)
                  setSearchQuery('')
                }}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Search */}
            <div className="px-5 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            
            {/* Model List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {Object.entries(groupedModels).map(([category, models]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {models.map((model) => (
                      <motion.button
                        key={model.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectModel(model.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                          selectedModel === model.id
                            ? 'bg-primary/15 border border-primary/30'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className={`text-sm font-medium ${selectedModel === model.id ? 'text-primary' : ''}`}>
                            {model.name}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
                            {model.id}
                          </span>
                        </div>
                        {selectedModel === model.id && (
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedModels).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-muted-foreground">No models found</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
