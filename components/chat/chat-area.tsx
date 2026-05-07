'use client'

import { useAppStore, Message } from '@/lib/store'
import { ChatMessage } from './chat-message'
import { Sparkles, ArrowDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ChatAreaProps {
  streamingMessageId?: string
}

export function ChatArea({ streamingMessageId }: ChatAreaProps) {
  const { getCurrentChat, chats, currentChatId } = useAppStore()
  const chat = getCurrentChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat?.messages, currentChatId])
  
  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }
  
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  if (!chat || chat.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-semibold mb-2"
        >
          Hello, I&apos;m Shrpo
        </motion.h1>
        
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm max-w-xs"
        >
          How can I help you today? Ask me anything or upload an image for analysis.
        </motion.p>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm"
        >
          {[
            { text: 'Write a story', textAr: 'اكتب قصة' },
            { text: 'Explain quantum physics', textAr: 'اشرح فيزياء الكم' },
            { text: 'Debug my code', textAr: 'صحح الكود' },
            { text: 'Plan a trip', textAr: 'خطط رحلة' },
          ].map((suggestion, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 text-sm text-left bg-card border border-border rounded-xl hover:bg-card/80 transition-colors"
            >
              {suggestion.text}
            </motion.button>
          ))}
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 pt-4 pb-48"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {chat.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={message.id === streamingMessageId}
              />
            ))}
          </AnimatePresence>
        </div>
        <div ref={bottomRef} />
      </div>
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToBottom}
            className="absolute bottom-52 right-4 p-3 bg-secondary/90 backdrop-blur-sm rounded-full shadow-lg border border-border"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
