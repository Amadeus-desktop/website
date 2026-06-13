import { create } from "zustand";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  isStreaming?: boolean;
};

type ChatStore = {
  messages: ChatMessage[];
  draft: string;
  isStreaming: boolean;
  intimacyScore: number;
  intimacyLevel: string;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateStreamingMessage: (content: string) => void;
  finalizeStreamingMessage: () => void;
  setDraft: (draft: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setIntimacy: (score: number, level: string) => void;
  reset: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  draft: "",
  isStreaming: false,
  intimacyScore: 0,
  intimacyLevel: "stranger",

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateStreamingMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last?.isStreaming) {
        messages[messages.length - 1] = { ...last, content };
      }
      return { messages };
    }),

  finalizeStreamingMessage: () =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last?.isStreaming) {
        messages[messages.length - 1] = { ...last, isStreaming: false };
      }
      return { messages };
    }),

  setDraft: (draft) => set({ draft }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),

  setIntimacy: (score, level) => set({ intimacyScore: score, intimacyLevel: level }),

  reset: () =>
    set({
      messages: [],
      draft: "",
      isStreaming: false,
      intimacyScore: 0,
      intimacyLevel: "stranger",
    }),
}));
