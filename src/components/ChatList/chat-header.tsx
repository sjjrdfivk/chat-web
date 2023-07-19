import { memo, FC } from "react";
import styles from "./index.module.scss";
import { textUploadApi } from "../../services/api";

interface IChatListHeader {
  onAddChat: () => void;
  onAddTextChat: () => void;
}

export const ChatListHeader: FC<IChatListHeader> = memo(
  ({ onAddChat, onAddTextChat }) => {
    const handleFileUpload = async (event: any) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await textUploadApi(formData);
      if (response.ok) {
        await response.text();
        onAddTextChat();
      } else {
        alert("文件上传失败");
      }
    };

    return (
      <div className={styles["chat-list-header"]}>
        <input className={styles["chat-list-input"]} placeholder="搜索" />
        <label className={styles["chat-list-header-text-add"]}>
          文
          <input
            type="file"
            className={styles["chat-list-file-text-upload"]}
            accept=".txt"
            onChange={handleFileUpload}
          />
        </label>
        <div className={styles["chat-list-header-add"]} onClick={onAddChat}>
          +
        </div>
      </div>
    );
  }
);
