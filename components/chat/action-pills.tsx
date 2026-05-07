'use client'

import { Zap, Brain, Crown, ImageIcon } from 'lucide-react'
import { useAppStore, ActionMode } from '@/lib/store'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

// NVIDIA production model IDs for each action mode
const ACTION_MODE_MODELS: Record<ActionMode, string> = {
  fast: 'nvidia/llama-3.1-nemotron-70b-instruct',
  thinking: 'moonshotai/kimi-k2-thinking',
  pro: 'meta/llama-3.3-70b-instruct',
  image: 'google/gemma-2-27b-it',
}

const actions: { mode: ActionMode; label: string; icon: React.ElementType; modelName: string }[] = [
  { mode: 'fast', label: 'Fast', icon: Zap, modelName: 'Nemotron 70B' },
  { mode: 'thinking', label: 'Thinking', icon: Brain, modelName: 'Kimi K2 Thinking' },
  { mode: 'pro', label: 'Pro', icon: Crown, modelName: 'Llama 3.3 70B' },
  { mode: 'image', label: 'General', icon: ImageIcon, modelName: 'Gemma 2 27B' },
]

export function ActionPills() {
  const { actionMode, setActionMode, setSelectedModel } = useAppStore()
  
  const handleModeSelect = (mode: ActionMode) => {
    const modelName = actions.find(a => a.mode === mode)?.modelName || mode
    const modelId = ACTION_MODE_MODELS[mode]
    
    console.log(`Switching to ${modelName} (${modelId})`)
    toast.success(`Switching to ${modelName}`, {
      description: modelId,
      duration: 2000,
    })
    
    setActionMode(mode)
    setSelectedModel(modelId)
  }
  
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 px-4 pb-2 min-w-max">
        {actions.map(({ mode, label, icon: Icon, modelName }) => (
          <motion.button
            key={mode}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeSelect(mode)}
            title={`Uses ${modelName}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              actionMode === mode
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Export for use in other components
export { ACTION_MODE_MODELS }
