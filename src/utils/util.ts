export const trimTopic = (topic: string): string => {
  const regex = /{"text":"([^"]+)"}/g;
  const matches = topic.match(regex);
  if (matches) {
    const texts = matches
      ?.map((match: string | null) => {
        if (match) {
          const textMatch = match.match(/{"text":"([^"]+)"}/);
          return /^\s*$/.test(textMatch?.[1] || "") ? "" : textMatch?.[1];
        }
        return "";
      })
      .filter(Boolean);
    return texts?.join("") || "";
  }
  return "";
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (error) {}
    document.body.removeChild(textArea);
  }
};
