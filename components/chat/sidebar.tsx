'use client'

import { X, Plus, MessageSquare, Trash2, Sparkles } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

export function Sidebar() {
  const { 
    isSidebarOpen, 
    setSidebarOpen, 
    chats, 
    currentChatId, 
    setCurrentChat, 
    createChat,
    deleteChat 
  } = useAppStore()
  
  const handleNewChat = () => {
    createChat()
    setSidebarOpen(false)
  }
  
  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId)
    setSidebarOpen(false)
  }
  
  const groupedChats = chats.reduce((groups, chat) => {
    const date = new Date(chat.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let group: string
    if (date.toDateString() === today.toDateString()) {
      group = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = 'Yesterday'
    } else {
      group = format(date, 'MMMM d, yyyy')
    }
    
    if (!groups[group]) groups[group] = []
    groups[group].push(chat)
    return groups
  }, {} as Record<string, typeof chats>)
  
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold gradient-text">Shrpo</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* New Chat Button */}
            <div className="p-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">New Chat</span>
              </motion.button>
            </div>
            
            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {Object.entries(groupedChats).map(([group, groupChats]) => (
                <div key={group} className="mb-4">
                  <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {groupChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectChat(chat.id)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          currentChatId === chat.id
                            ? 'bg-sidebar-accent'
                            : 'hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 text-sm truncate">
                          {chat.title}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChat(chat.id)
                          }}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              
              {chats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No chats yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Start a new conversation</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
