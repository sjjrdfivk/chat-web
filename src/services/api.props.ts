export interface BitoRequestChatStreamData {
  context: BitoContext[];
  prompt: string;
}

export interface BitoContext {
  question: string;
  answer: string;
}
