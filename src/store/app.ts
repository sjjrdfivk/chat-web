import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 } from "uuid";
import { requestChatStream } from "../services/api";
import { BitoContext } from "../services/api.props";

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
  deleteSession: (i: number) => void;
  setSession: (value: string) => Promise<void>;
  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  selectSession: (index: number) => void;
  getMessagesWithMemory: () => BitoContext[];
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
      sessions: [createEmptySession()],
      currentSessionIndex: 0,
      currentSession() {
        let index = get().currentSessionIndex;
        const sessions = get().sessions;
        const session = sessions[index];
        return session;
      },
      setNewSession() {
        set((state) => ({
          currentSessionIndex: 0,
          sessions: [createEmptySession()].concat(state.sessions),
        }));
      },
      deleteSession(i: number) {
        const index = i ?? get().currentSessionIndex;
        set((state) => {
          const sessions = state.sessions;
          if (sessions.length === 1) {
            return {
              currentSessionIndex: 0,
              sessions: [createEmptySession()],
            };
          }
          sessions.splice(index, 1);
          return {
            currentSessionIndex: 0,
            sessions,
          };
        });
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
        const recentMessages = get().getMessagesWithMemory();

        const sendMessages = {
          context: recentMessages,
          prompt: content,
        };

        get().updateCurrentSession((session) => {
          session.messages.push(userMessage);
          session.messages.push(botMessage);
        });

        requestChatStream(sendMessages, {
          onMessage(content, done) {
            botMessage.content = content;
            set(() => ({}));
          },
        });
      },
      getMessagesWithMemory(): BitoContext[] {
        let index = get().currentSessionIndex;
        const sessions = get().sessions;
        const messages = sessions[index].messages;
        const conversations = [];
        for (let i = 0; i < messages.length; i += 2) {
          const question = messages[i].content;
          const answer = messages[i + 1].content;
          const conversation = {
            question: question,
            answer: answer,
          };
          conversations.push(conversation);
        }
        return conversations;
      },
      updateCurrentSession(updater) {
        const sessions = get().sessions;
        const index = get().currentSessionIndex;
        updater(sessions[index]);
        set(() => ({ sessions }));
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
