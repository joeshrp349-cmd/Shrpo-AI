'use client'

import { Plus, Mic, Send, X, ImageIcon } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useCallback } from 'react'
import { ActionPills } from './action-pills'

interface ChatInputProps {
  onSend: (message: string, image?: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const { isStreaming } = useAppStore()
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const handleSubmit = useCallback(() => {
    if ((!message.trim() && !image) || isStreaming) return
    onSend(message.trim(), image || undefined)
    setMessage('')
    setImage(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [message, image, isStreaming, onSend])
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // Stop recording logic would go here
    } else {
      setIsRecording(true)
      // Start recording logic would go here
      // Using Web Speech API would require additional setup
    }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-6 px-4 z-30">
      {/* Action Pills */}
      <ActionPills />
      
      {/* Image Preview */}
      <AnimatePresence>
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 relative inline-block"
          >
            <img
              src={image}
              alt="Upload preview"
              className="h-20 w-auto rounded-lg border border-border"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full"
            >
              <X className="w-3 h-3 text-destructive-foreground" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Input Bar */}
      <div className="flex items-end gap-2 bg-secondary/80 backdrop-blur-xl rounded-3xl border border-border/50 p-2 shadow-xl">
        {/* Add Image Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors flex-shrink-0"
          disabled={isStreaming}
        >
          <Plus className="w-5 h-5 text-foreground" />
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Shrpo..."
          rows={1}
          disabled={isStreaming}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-base py-2 px-1 max-h-[120px] min-h-[40px]"
          style={{ direction: 'auto' }}
        />
        
        {/* Voice / Send Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={message.trim() || image ? handleSubmit : toggleRecording}
          disabled={isStreaming}
          className={`p-2.5 rounded-full flex-shrink-0 transition-colors ${
            message.trim() || image
              ? 'bg-primary hover:bg-primary/90'
              : isRecording
              ? 'bg-destructive animate-pulse'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {message.trim() || image ? (
            <Send className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Mic className={`w-5 h-5 ${isRecording ? 'text-destructive-foreground' : 'text-foreground'}`} />
          )}
        </motion.button>
      </div>
      
      {/* Loading indicator */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center mt-2"
          >
            <div className="flex gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
