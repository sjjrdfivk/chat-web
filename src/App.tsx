import styles from "./App.module.scss";
import { ChatList, Chat } from "./components";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <ChatList />
      </div>
      <div className={styles["window-content"]}>
        <Chat
          key="chat"
          // showSideBar={() => setShowSideBar(true)}
          // sideBarShowing={showSideBar}
        />
      </div>
    </div>
  );
}

export default App;
