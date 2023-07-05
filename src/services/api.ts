import { trimTopic } from "../utils/util";

// const url = "http://139.159.184.27:5000/";
const url = "http://172.16.100.17:5000/";

export const requestChatStream = async (
  message: string,
  options?: {
    filterBot?: boolean;
    // modelConfig?: ModelConfig;
    onMessage: (message: string, done: boolean) => void;
    onError?: (error: Error, statusCode?: number) => void;
    onController?: (controller: AbortController) => void;
  }
) => {
  try {
    const res = await fetch(url + "chat", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let responseText = "";

    if (res.ok) {
      const reader = res?.body?.getReader();
      if (reader) {
        void (function read() {
          reader.read().then(({ done, value }) => {
            const text = new TextDecoder().decode(value, { stream: true });
            responseText += text;
            options?.onMessage(trimTopic(responseText), done);
            if (done) return;
            read();
          });
        })();
      }
    }
  } catch (error) {}
};
