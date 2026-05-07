import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  image?: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  model: string
}

export type ActionMode = 'fast' | 'thinking' | 'pro' | 'image'

interface AppState {
  // API Key
  apiKey: string | null
  setApiKey: (key: string | null) => void
  
  // Chats
  chats: Chat[]
  currentChatId: string | null
  createChat: () => string
  deleteChat: (id: string) => void
  setCurrentChat: (id: string | null) => void
  addMessage: (chatId: string, message: Message) => void
  updateMessage: (chatId: string, messageId: string, content: string) => void
  updateChatTitle: (chatId: string, title: string) => void
  
  // Model
  selectedModel: string
  setSelectedModel: (model: string) => void
  
  // Action Mode
  actionMode: ActionMode
  setActionMode: (mode: ActionMode) => void
  
  // UI State
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isModelSelectorOpen: boolean
  setModelSelectorOpen: (open: boolean) => void
  isSettingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  
  // Streaming
  isStreaming: boolean
  setStreaming: (streaming: boolean) => void
  
  // Current chat helper
  getCurrentChat: () => Chat | undefined
}

export const NVIDIA_MODELS = [
  // Llama Models
  { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', category: 'Llama' },
  { id: 'meta/llama-3.2-90b-vision-instruct', name: 'Llama 3.2 90B Vision', category: 'Llama' },
  { id: 'meta/llama-3.2-11b-vision-instruct', name: 'Llama 3.2 11B Vision', category: 'Llama' },
  { id: 'meta/llama-3.2-3b-instruct', name: 'Llama 3.2 3B', category: 'Llama' },
  { id: 'meta/llama-3.2-1b-instruct', name: 'Llama 3.2 1B', category: 'Llama' },
  { id: 'meta/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', category: 'Llama' },
  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', category: 'Llama' },
  { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', category: 'Llama' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'Nemotron 70B', category: 'Llama' },
  { id: 'nvidia/llama-3.1-nemotron-nano-8b-v1', name: 'Nemotron Nano 8B', category: 'Llama' },
  { id: 'meta/llama-4-maverick-17b-128e-instruct', name: 'Llama 4 Maverick 17B', category: 'Llama' },
  { id: 'nvidia/llama-3.3-nemotron-super-49b-v1.5', name: 'Nemotron Super 49B', category: 'Llama' },
  
  // DeepSeek & Qwen & Kimi
  { id: 'nvidia/deepseek-v3', name: 'DeepSeek V3 (Fast)', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'deepseek-ai/deepseek-v4-pro', name: 'DeepSeek V4 Pro', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'deepseek-ai/deepseek-v4-flash', name: 'DeepSeek V4 Flash', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'qwen/qwen3-next-80b-a3b-thinking', name: 'Qwen3 Next 80B Thinking', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'qwen/qwen3-next-80b-a3b-instruct', name: 'Qwen3 Next 80B Instruct', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'qwen/qwen3-coder-480b-a35b-instruct', name: 'Qwen3 Coder 480B', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'qwen/qwen2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'moonshotai/kimi-k2-thinking', name: 'Kimi K2 Thinking', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'moonshotai/kimi-k2.6', name: 'Kimi K2.6', category: 'DeepSeek & Qwen & Kimi' },
  { id: 'moonshotai/kimi-k2-instruct', name: 'Kimi K2 Instruct', category: 'DeepSeek & Qwen & Kimi' },
  
  // Mistral & Google & Microsoft
  { id: 'mistralai/mistral-large-3-675b-instruct-2512', name: 'Mistral Large 3 675B', category: 'Mistral & Google & Microsoft' },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'Mixtral 8x22B', category: 'Mistral & Google & Microsoft' },
  { id: 'mistralai/pixtral-12b-2409', name: 'Pixtral 12B', category: 'Mistral & Google & Microsoft' },
  { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B', category: 'Mistral & Google & Microsoft' },
  { id: 'google/gemma-3n-e4b-it', name: 'Gemma 3n E4B', category: 'Mistral & Google & Microsoft' },
  { id: 'google/gemma-2-2b-it', name: 'Gemma 2 2B', category: 'Mistral & Google & Microsoft' },
  { id: 'microsoft/phi-4-mini-instruct', name: 'Phi-4 Mini', category: 'Mistral & Google & Microsoft' },
  { id: 'microsoft/phi-4-multimodal-instruct', name: 'Phi-4 Multimodal', category: 'Mistral & Google & Microsoft' },
  
  // Specialized Models
  { id: 'nvidia/usdcode', name: 'USD Code', category: 'Specialized' },
  { id: 'nvidia/nemotron-mini-4b-instruct', name: 'Nemotron Mini 4B', category: 'Specialized' },
  { id: 'stepfun-ai/step-3.5-flash', name: 'Step 3.5 Flash', category: 'Specialized' },
  { id: 'minimaxai/minimax-m2.7', name: 'MiniMax M2.7', category: 'Specialized' },
  
  // GPT Models
  { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B', category: 'GPT' },
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B', category: 'GPT' },
  
  // Additional Models
  { id: 'bytedance/seed-oss-36b-instruct', name: 'Seed OSS 36B', category: 'Additional' },
  { id: 'minimaxai/minimax-m2.5', name: 'MiniMax M2.5', category: 'Additional' },
  { id: 'stockmark/stockmark-2-100b-instruct', name: 'Stockmark 2 100B', category: 'Additional' },
  { id: 'sarvamai/sarvam-m', name: 'Sarvam M', category: 'Additional' },
  { id: 'abacusai/dracarys-llama-3.1-70b-instruct', name: 'Dracarys Llama 70B', category: 'Additional' },
  { id: 'z-ai/glm-5.1', name: 'GLM 5.1', category: 'Additional' },
  { id: 'z-ai/glm-4.7', name: 'GLM 4.7', category: 'Additional' },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // API Key
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      
      // Chats
      chats: [],
      currentChatId: null,
      
      createChat: () => {
        const id = crypto.randomUUID()
        const newChat: Chat = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          model: get().selectedModel,
        }
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: id,
        }))
        return id
      },
      
      deleteChat: (id) => set((state) => {
        const newChats = state.chats.filter((chat) => chat.id !== id)
        return {
          chats: newChats,
          currentChatId: state.currentChatId === id 
            ? (newChats[0]?.id ?? null) 
            : state.currentChatId,
        }
      }),
      
      setCurrentChat: (id) => set({ currentChatId: id }),
      
      addMessage: (chatId, message) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        ),
      })),
      
      updateMessage: (chatId, messageId, content) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, content } : msg
                ),
              }
            : chat
        ),
      })),
      
      updateChatTitle: (chatId, title) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, title } : chat
        ),
      })),
      
      // Model - Default to nvidia/llama-3.1-nemotron-70b-instruct for 'fast' mode
      selectedModel: 'nvidia/llama-3.1-nemotron-70b-instruct',
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      // Action Mode - Default to 'fast' (DeepSeek V3)
      actionMode: 'fast',
      setActionMode: (mode) => set({ actionMode: mode }),
      
      // UI State
      isSidebarOpen: false,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      isModelSelectorOpen: false,
      setModelSelectorOpen: (open) => set({ isModelSelectorOpen: open }),
      isSettingsOpen: false,
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      
      // Streaming
      isStreaming: false,
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      
      // Current chat helper
      getCurrentChat: () => {
        const state = get()
        return state.chats.find((chat) => chat.id === state.currentChatId)
      },
    }),
    {
      name: 'shrpo-ai-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        chats: state.chats,
        selectedModel: state.selectedModel,
      }),
    }
  )
)
