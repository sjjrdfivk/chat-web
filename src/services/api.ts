import { BitoRequestChatStreamData } from "./api.props";

// const url = "http://139.159.184.27:5000/";
const url = "http://172.16.100.17:5000/";

export const requestChatStream = async (
  data: BitoRequestChatStreamData,
  options?: {
    onMessage: (message: string, done?: boolean) => void;
    onError?: (error: Error, statusCode?: number) => void;
    onController?: (controller: AbortController) => void;
  }
) => {
  try {
    const res = await fetch(url + "chat", {
      method: "POST",
      body: JSON.stringify(data),
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
            options?.onMessage(responseText, done);
            if (done) return;
            read();
          });
        })();
      }
    }
  } catch (error) {}
};

export const textUploadApi = async (formData: FormData) => {
  return await fetch(url + "build_index", {
    method: "POST",
    body: formData,
  });
};

export const llmChatApi = async (
  data: BitoRequestChatStreamData,
  options?: {
    onMessage: (message: string, done?: boolean) => void;
  }
) => {
  const res = await fetch(url + "llm_chat", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const data = await res.text();
    options?.onMessage(data);
  }
};
