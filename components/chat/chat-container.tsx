'use client'

import { useCallback, useState } from 'react'
import { useAppStore, Message } from '@/lib/store'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { ModelSelector } from './model-selector'
import { ChatArea } from './chat-area'
import { ChatInput } from './chat-input'
import { Settings } from './settings'
import { ApiKeyPrompt } from './api-key-prompt'

export function ChatContainer() {
  const {
    apiKey,
    currentChatId,
    createChat,
    addMessage,
    updateMessage,
    updateChatTitle,
    selectedModel,
    actionMode,
    setStreaming,
  } = useAppStore()
  
  const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>()
  
  const handleSendMessage = useCallback(async (content: string, image?: string) => {
    if (!apiKey) return
    
    // Create chat if none exists
    let chatId = currentChatId
    if (!chatId) {
      chatId = createChat()
    }
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
      image,
    }
    addMessage(chatId, userMessage)
    
    // Update chat title if it's the first message
    const chat = useAppStore.getState().chats.find(c => c.id === chatId)
    if (chat && chat.messages.length === 0) {
      const title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
      updateChatTitle(chatId, title)
    }
    
    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    addMessage(chatId, assistantMessage)
    setStreamingMessageId(assistantMessage.id)
    setStreaming(true)
    
    try {
      // Get messages for context
      const messages = useAppStore.getState().chats
        .find(c => c.id === chatId)?.messages
        .filter(m => m.id !== assistantMessage.id)
        .map(m => ({
          role: m.role,
          content: m.content,
          image: m.image,
        })) || []
      
      console.log('[v0] Sending request with model:', selectedModel)
      console.log('[v0] Action mode:', actionMode)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model: selectedModel,
          apiKey,
          actionMode,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        console.error('[v0] API Error Response:', error)
        console.error('[v0] Model that failed:', selectedModel)
        console.error('[v0] Action mode:', actionMode)
        throw new Error(error.error || 'Failed to get response')
      }
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')
      
      const decoder = new TextDecoder()
      let fullContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullContent += parsed.content
                updateMessage(chatId, assistantMessage.id, fullContent)
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      updateMessage(chatId, assistantMessage.id, `Error: ${errorMessage}`)
    } finally {
      setStreaming(false)
      setStreamingMessageId(undefined)
    }
  }, [apiKey, currentChatId, createChat, addMessage, updateMessage, updateChatTitle, selectedModel, actionMode, setStreaming])
  
  // Show API key prompt if no key is set
  if (!apiKey) {
    return <ApiKeyPrompt />
  }
  
  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <Header />
      <Sidebar />
      <ModelSelector />
      <Settings />
      
      {/* Main content area with proper padding */}
      <main className="flex-1 flex flex-col pt-14 overflow-hidden">
        <ChatArea streamingMessageId={streamingMessageId} />
        <ChatInput onSend={handleSendMessage} />
      </main>
    </div>
  )
}
