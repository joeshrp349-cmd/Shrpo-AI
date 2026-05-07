'use client'

import { User, Sparkles, Copy, Check } from 'lucide-react'
import { Message } from '@/lib/store'
import { getTextDirection } from '@/lib/rtl'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const textDirection = getTextDirection(message.content)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // Format content with markdown-like styling
  const formatContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3)
        const [lang, ...lines] = code.split('\n')
        const codeContent = lines.join('\n')
        
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden bg-background/50 border border-border">
            {lang && (
              <div className="px-3 py-1.5 bg-muted/50 text-xs text-muted-foreground border-b border-border">
                {lang}
              </div>
            )}
            <pre className="p-3 overflow-x-auto text-sm">
              <code>{codeContent || lang}</code>
            </pre>
          </div>
        )
      }
      
      // Handle inline formatting
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.split(/(\*\*.*?\*\*)/g).map((segment, i) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return <strong key={i}>{segment.slice(2, -2)}</strong>
            }
            return segment
          })}
        </span>
      )
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Image if present */}
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="max-w-full h-auto max-h-48 rounded-lg mb-2"
          />
        )}
        
        {/* Message bubble */}
        <div
          dir={textDirection}
          className={`relative group px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-card border border-border rounded-bl-md'
          }`}
        >
          <div className={`text-[15px] leading-relaxed ${isStreaming ? 'typing-cursor' : ''}`}>
            {formatContent(message.content)}
          </div>
          
          {/* Copy button for assistant messages */}
          {!isUser && !isStreaming && message.content && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="absolute -bottom-8 left-0 p-1.5 rounded-lg bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-foreground" />
        </div>
      )}
    </motion.div>
  )
}
