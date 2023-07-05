import { memo, FC, useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import styles from "./index.module.scss";
import { ChatItem } from "./chat-item";
import { ChatListHeader } from "./chat-header";
import { useChatStore } from "../../store";

export const ChatList: FC = memo((props) => {
  // const [chatList, setChatList] = useState<IChatList[]>([]);
  const [chatList, selectedIndex, createNewSession, selectSession] =
    useChatStore((state) => [
      state.sessions,
      state.currentSessionIndex,
      state.setNewSession,
      state.selectSession,
    ]);

  const onDragEnd = () => {};

  const onAddChat = () => {
    createNewSession();
  };

  return (
    <>
      <ChatListHeader onAddChat={onAddChat} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chat-list">
          {(provided) => (
            <div
              className={styles["chat-list"]}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {chatList.map((item, i) => (
                <ChatItem
                  title={item.title}
                  time={item.lastUpdate}
                  // count={item.messages.length}
                  key={item.id}
                  id={item.id}
                  index={i}
                  selected={i === selectedIndex}
                  onClick={() => selectSession(i)}
                  // onDelete={() => chatStore.deleteSession(i)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
});
