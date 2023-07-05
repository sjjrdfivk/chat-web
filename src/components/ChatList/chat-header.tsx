import { memo, FC } from "react";
import styles from "./index.module.scss";

interface IChatListHeader {
  onAddChat: () => void;
}

export const ChatListHeader: FC<IChatListHeader> = memo(({ onAddChat }) => {
  return (
    <div className={styles["chat-list-header"]}>
      <input className={styles["chat-list-input"]} />
      <div className={styles["chat-list-header-add"]} onClick={onAddChat}>
        +
      </div>
    </div>
  );
});
