import { memo, FC } from "react";
import { Draggable } from "@hello-pangea/dnd";
import styles from "./index.module.scss";
import { IChatItem } from "./chat.props";
import moment from "moment";

export const ChatItem: FC<IChatItem> = memo((props) => {
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected && styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles["chat-item-title"]}>{props.title}</div>
          <div className={styles["chat-item-info"]}>
            <div className={styles["chat-item-count"]}>
              {/* {Locale.ChatItem.ChatItemCount(props.count)}
              66 */}
            </div>
            <div className={styles["chat-item-date"]}>
              {moment(props.time).format("YYYY-MM-DD hh:mm:ss")}
            </div>
          </div>
          {/* <div className={styles["chat-item-delete"]} onClick={props.onDelete}>
            X
          </div> */}
        </div>
      )}
    </Draggable>
  );
});
