export interface BitoRequestChatStreamData {
  context: BitoContext[];
  prompt?: string;
}

export interface BitoContext {
  role: string;
  content: string;
}
