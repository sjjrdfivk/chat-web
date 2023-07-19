import { memo, FC } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import styles from "./index.module.scss";
import { ChatItem } from "./chat-item";
import { ChatListHeader } from "./chat-header";
import { useChatStore } from "../../store";

export const ChatList: FC = memo((props) => {
  const [
    chatList,
    selectedIndex,
    createNewSession,
    selectSession,
    deleteSession,
  ] = useChatStore((state) => [
    state.sessions,
    state.currentSessionIndex,
    state.setNewSession,
    state.selectSession,
    state.deleteSession,
  ]);

  const onDragEnd = () => {};

  return (
    <>
      <ChatListHeader
        onAddChat={() => createNewSession(0)}
        onAddTextChat={() => createNewSession(1)}
      />
      <div className={styles["sidebar-body"]}>
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
                    title={item["messages"][0]?.content || item.title}
                    time={item.lastUpdate}
                    key={item.id}
                    id={item.id}
                    index={i}
                    selected={i === selectedIndex}
                    onClick={() => selectSession(i)}
                    onDelete={() => deleteSession(i)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
});
