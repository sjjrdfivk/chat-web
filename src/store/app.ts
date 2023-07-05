import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 } from "uuid";
import { requestChatStream } from "../services/api";

interface ChatSession {
  title: string;
  lastUpdate: Date;
  id: string;
  messages: {
    content: string;
    role: string;
  }[];
}

interface ChatStore {
  sessions: ChatSession[];
  currentSessionIndex: number;
  currentSession: () => ChatSession;
  setNewSession: () => void;
  setSession: (value: string) => Promise<void>;
  setCurrentSessionIndex: (index: number) => void;
  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  selectSession: (index: number) => void;
}

const createEmptySession = (): ChatSession => {
  return {
    title: "新的聊天",
    lastUpdate: new Date(),
    id: v4(),
    messages: [],
  };
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionIndex: 0,
      setNewSession() {
        set((state) => ({
          sessions: [createEmptySession()].concat(state.sessions),
        }));
      },
      setCurrentSessionIndex(index) {
        set(() => ({
          currentSessionIndex: index,
        }));
      },
      async setSession(content) {
        const userMessage = {
          role: "user",
          content,
        };
        const botMessage = {
          role: "assistant",
          content: "",
        };
        get().updateCurrentSession((session) => {
          session.messages.push(userMessage);
          session.messages.push(botMessage);
        });
        requestChatStream(content, {
          onMessage(content, done) {
            botMessage.content = content;
            set(() => ({}));
          },
        });
      },
      updateCurrentSession(updater) {
        const sessions = get().sessions;
        const index = get().currentSessionIndex;
        updater(sessions[index]);
        set(() => ({ sessions }));
      },
      currentSession() {
        let index = get().currentSessionIndex;
        const sessions = get().sessions;
        const session = sessions[index];

        return session;
      },
      selectSession(index: number) {
        set({
          currentSessionIndex: index,
        });
      },
    }),
    {
      name: "bito-chat", // unique name
    }
  )
);
