import {
  memo,
  FC,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import styles from "./index.module.scss";
import { IconButton } from "../IconButton/icon-button";
import { requestChatStream } from "../../services/api";
import { IMessagesProps } from "./chat.props";
import "katex/dist/katex.min.css";
import { Markdown } from "../index";
import { useChatStore } from "../../store";

export const Chat: FC = memo((props) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [hitBottom, setHitBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessions, setSession] = useChatStore((state) => [
    state.currentSession(),
    state.setSession,
  ]);

  const onChatBodyScroll = (e: HTMLElement) => {
    setAutoScroll(false);
    const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 20;
    setHitBottom(isTouchBottom);
  };

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const onUserSubmit = (value: string) => {
    setSession(value).then(() => setIsLoading(false));
    setUserInput("");
    scrollToBottom();
    setAutoScroll(true);
  };

  const onInputKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      scrollToBottom();
      setIsLoading(true);
      onUserSubmit(e.target.value);
      e.preventDefault();
    }
  };

  const scrollToBottom = () => {
    const container = scrollRef.current;
    if (container?.scrollHeight && autoScroll) {
      container.scrollTop = container.scrollHeight;
      // setTimeout(() => (container.scrollTop = container.scrollHeight), 1);
    }
  };

  useLayoutEffect(() => {
    // console.log("123");
    scrollToBottom();
  });

  // const messages = sessions.messages;
  const messages = sessions.messages;

  // useEffect(() => {
  //   console.log("123");
  //   scrollToBottom();
  // }, [messages]);

  return (
    <div className={styles.chat} key={`session.id`}>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div
            className={`${styles["window-header-main-title"]} ${styles["chat-body-title"]}`}
          ></div>
        </div>
      </div>

      <div
        className={styles["chat-body"]}
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        {messages.map((message, i) => {
          const isUser = message?.role === "user";

          return (
            <div
              key={i}
              className={
                isUser ? styles["chat-message-user"] : styles["chat-message"]
              }
            >
              <div className={styles["chat-message-container"]}>
                <div className={styles["chat-message-item"]}>
                  <div
                    className={
                      isLoading && !isUser && messages.length - 1 === i
                        ? "streaming markdown-body"
                        : isUser
                        ? ""
                        : "markdown-body"
                    }
                  >
                    <span></span>
                    <Markdown
                      content={message.content}
                      isUser={isUser}
                    ></Markdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles["chat-input-panel"]}>
        {/* <PromptHints prompts={promptHints} onPromptSelect={onPromptSelect} /> */}
        <div className={styles["chat-input-panel-inner"]}>
          <textarea
            ref={inputRef}
            className={styles["chat-input"]}
            placeholder={`请输入!`}
            onInput={(e) => onInput(e.currentTarget.value)}
            value={userInput}
            onKeyDown={onInputKeyDown}
            onFocus={() => setAutoScroll(true)}
            onBlur={() => {
              setAutoScroll(false);
              // setTimeout(() => setPromptHints([]), 500);
            }}
            // autoFocus={!props?.sideBarShowing}
            // rows={inputRows}
          />
          <IconButton
            // icon={<SendWhiteIcon />}
            text={"发送"}
            className={styles["chat-input-send"]}
            noDark
            // onClick={onUserSubmit}
          />
        </div>
      </div>
    </div>
  );
});
