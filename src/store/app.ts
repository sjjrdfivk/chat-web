import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 } from "uuid";
import { requestChatStream, llmChatApi } from "../services/api";
import { BitoContext } from "../services/api.props";

export enum ChatSessionType {
  chat,
  llmChat,
}

interface ChatSession {
  title: string;
  lastUpdate: Date;
  id: string;
  messages: {
    content: string;
    role: string;
  }[];
  type: ChatSessionType;
}

interface ChatStore {
  sessions: ChatSession[];
  currentSessionIndex: number;
  currentSession: () => ChatSession;
  setNewSession: (type?: ChatSessionType) => void;
  deleteSession: (i: number) => void;
  setSession: (value: string) => Promise<void>;
  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  selectSession: (index: number) => void;
  getMessagesWithMemory: () => BitoContext[];
  getChatType: () => ChatSessionType;
}

const createEmptySession = (
  type: ChatSessionType = ChatSessionType.chat
): ChatSession => {
  return {
    title: "新的聊天",
    lastUpdate: new Date(),
    id: v4(),
    messages: [],
    type,
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
      setNewSession(type: ChatSessionType = ChatSessionType.chat) {
        set((state) => ({
          currentSessionIndex: 0,
          sessions: [createEmptySession(type)].concat(state.sessions),
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

        const getChatType = get().getChatType();

        const sendMessages = {
          context: [...recentMessages, { role: "user", content }],
        };

        get().updateCurrentSession((session) => {
          session.messages.push(userMessage);
          session.messages.push(botMessage);
        });

        if (getChatType === ChatSessionType.chat) {
          requestChatStream(sendMessages, {
            onMessage(content) {
              botMessage.content = content;
              set(() => ({}));
            },
          });
        } else if (getChatType === ChatSessionType.llmChat) {
          llmChatApi(sendMessages, {
            onMessage(content) {
              botMessage.content = content;
              set(() => ({}));
            },
          });
        }
      },
      getMessagesWithMemory(): BitoContext[] {
        let index = get().currentSessionIndex;
        const sessions = get().sessions;
        const messages = sessions[index].messages;
        return messages;
      },
      updateCurrentSession(updater) {
        const sessions = get().sessions;
        const index = get().currentSessionIndex;
        updater(sessions[index]);
        set(() => ({ sessions }));
      },
      getChatType() {
        const sessions = get().sessions;
        const index = get().currentSessionIndex;
        return sessions[index]["type"] || 0;
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
