import {
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography
} from "@material-ui/core";
import {
  ConnectOther,
  MessageSuccess,
  ReceiveChat,
  ReceiveMessage,
  SendMessage
} from "./api/SignalR";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  addProfilePicture,
  addUserToChat,
  deleteProfilePicture,
  getAllUserChats,
  getChatMessages,
  getGroupName
} from "./api/API";
import {
  bindMenu,
  bindTrigger,
  usePopupState
} from "material-ui-popup-state/hooks";

import AddIcon from "@material-ui/icons/Add";
import { Chat } from "./types/chat";
import ChatList from "./ChatList";
import ChatScreen from "./ChatScreen";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { Message } from "./types/message";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";
import UserIcon from "@material-ui/icons/AccountCircle";
import UserList from "./UserList";

enum ListView {
  Chat,
  User,
  AddUserToChat
}

function UserControlScreen() {
  const { user } = useContext<{
    user: User;
  }>(UserContainer);
  const [activeChat, setActiveChat] = useState<string>();
  const [chatToAddUserTo, setChatToAddUserTo] = useState<Chat>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [connection, setConnection] = useState<HubConnection>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [renderedList, setRenderedList] = useState<ListView>(ListView.Chat);

  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  async function createNewChat(connectTo: string) {
    const newChat = await getGroupName(user.username, connectTo);

    if (connection != null) ConnectOther(connection, connectTo, newChat.id);
    setChats(prevChats => prevChats.concat(newChat));
    setMessages(prevMessages => ({
      ...prevMessages,
      [newChat.id]: []
    }));
    return newChat;
  }

  function addMessage(
    username: string,
    chatId: string,
    text: string,
    sentAt: Date,
    tempId?: number
  ) {
    const chat = chats.find(chat => chat.id === chatId);
    if (chat != null) {
      const message = {
        user: chat.users.find(user => user.username === username)!,
        text,
        sentAt,
        tempId
      };
      setMessages(prevMessages => ({
        ...prevMessages,
        [chatId]:
          prevMessages[chatId] != null
            ? prevMessages[chatId].concat(message)
            : [message]
      }));
    }
  }

  const getActiveChatMessages = useCallback(async (chatId: string) => {
    if (chatId != null) {
      const messages = await getChatMessages(chatId);
      setMessages(prevMessages => ({
        ...prevMessages,
        [chatId]: messages.map(value => ({
          ...value,
          sentAt: new Date(value.sentAt)
        }))
      }));
    }
  }, []);

  async function handleChatSelect(id: string) {
    setActiveChat(undefined);
    if (messages[id] == null) {
      setLoading(true);
      await getActiveChatMessages(id);
      setLoading(false);
    }
    setActiveChat(id);
  }

  async function handleMessageSend(
    username: string,
    chatId: string,
    text: string
  ) {
    addMessage(username, chatId, text, new Date(), messages[chatId].length);
    return SendMessage(
      connection!,
      username,
      chatId,
      text,
      messages[chatId].length
    );
  }

  async function handleUserSelect(username: string) {
    setLoading(true);
    const chat = chats.find(
      chat =>
        chat.users.length === 2 &&
        chat.users.find(user => user.username === username) != null
    );
    if (chat != null) {
      if (messages[chat.id] == null) {
        await getActiveChatMessages(chat.id);
      }
      setActiveChat(chat.id);
    } else {
      const newChat = await createNewChat(username);
      await getActiveChatMessages(newChat.id);
      setActiveChat(newChat.id);
    }
    setRenderedList(ListView.Chat);
    setLoading(false);
  }

  async function handleAddUserToChatChatSelect(chat: Chat) {
    setChatToAddUserTo(chat);
    setRenderedList(ListView.AddUserToChat);
  }

  async function handleAddUserToChatUserSelect(username: string) {
    if (chatToAddUserTo != null) {
      const chatId = chatToAddUserTo.id;
      setLoading(true);
      const chatIndex = chats.findIndex(chat => chat.id === chatId);
      const updatedChat = await addUserToChat(chatId, username);
      if (messages[chatId] == null) {
        await getActiveChatMessages(chatId);
      }
      setChats(prevChats => {
        prevChats[chatIndex] = updatedChat;
        return prevChats;
      });

      setActiveChat(chatId);
    }
    setRenderedList(ListView.Chat);
    setLoading(false);
  }

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://192.168.1.69:8080/chat")
      .build();

    connection.on("ReceiveMessage", ReceiveMessage(chatsRef, setMessages));
    connection.on("ReceiveChat", ReceiveChat(setChats, setLoading));
    connection.on("MessageSuccess", MessageSuccess(setMessages));

    connection
      .start()
      .then(() => {
        setConnection(connection);
        connection.invoke("Connect", user.username);
      })
      .catch(error => {
        console.log(error);
      });

    return () => {
      connection.stop();
    };
  }, [chatsRef, setChats, setMessages, user.username]);

  useEffect(() => {
    setLoading(true);
    getAllUserChats(user.username).then(chats => {
      setChats(chats);
      setLoading(false);
    });
  }, [user.username]);

  return (
    <Paper style={{ margin: 40, height: "calc(100vh - 80px)" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={3} style={{ maxHeight: "100%" }}>
          <Paper style={{ height: "100%", width: "100%" }}>
            <Grid container direction="column" style={{ height: "100%" }}>
              <Grid item>
                <Typography variant="h5" style={{ padding: "8px 16px" }}>
                  {renderedList === ListView.Chat ? "Chats" : "Users"}
                </Typography>
              </Grid>
              <Grid item>{loading ? <LinearProgress /> : <Divider />}</Grid>
              <Grid item xs style={{ overflowY: "auto" }}>
                {renderedList === ListView.Chat && (
                  <ChatList
                    activeChat={activeChat}
                    chats={chats}
                    lastMessages={Object.assign(
                      {},
                      ...chats.map(chat => ({ [chat.id]: chat.lastMessage })),
                      ...Object.keys(messages).map(key => ({
                        [key]: messages[key][messages[key].length - 1]
                      }))
                    )}
                    onChatSelect={handleChatSelect}
                    onAddUserToChatSelect={handleAddUserToChatChatSelect}
                  />
                )}
                {renderedList === ListView.User && (
                  <UserList onUserSelect={handleUserSelect} />
                )}
                {renderedList === ListView.AddUserToChat && (
                  <UserList
                    onUserSelect={handleAddUserToChatUserSelect}
                    excludedUsers={
                      chatToAddUserTo != null
                        ? chatToAddUserTo.users.map(user => user.username)
                        : []
                    }
                  />
                )}
              </Grid>
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <ControlFooter
                  renderedList={renderedList}
                  onAddUserButtonClick={() => {
                    setRenderedList(prevRenderedList =>
                      prevRenderedList === ListView.Chat
                        ? ListView.User
                        : ListView.Chat
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={9} style={{ maxHeight: "100%" }}>
          {activeChat != null && user != null ? (
            <ChatScreen
              activeChat={activeChat}
              messages={messages[activeChat]}
              user={user}
              onMessageSend={handleMessageSend}
            />
          ) : (
            <Paper style={{ width: "100%", height: "100%" }} />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

function AddUserButton(props: { currentList: ListView; onClick: () => any }) {
  const { currentList, onClick } = props;

  return (
    <Tooltip title="Add user">
      <IconButton
        onClick={onClick}
        style={{
          transform: currentList !== ListView.Chat ? "rotate(45deg)" : "",
          transition: "transform 300ms ease"
        }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
}

function ControlFooter(props: {
  renderedList: ListView;
  onAddUserButtonClick: () => any;
}) {
  const popupState = usePopupState({ variant: "popover" });
  const [removing, setRemoving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const { user, setUser } = useContext<{
    user: User;
    setUser: (user: (User | undefined) | (() => User | undefined)) => any;
  }>(UserContainer);
  const { renderedList, onAddUserButtonClick } = props;

  function handleImageSelected(event: React.FormEvent<HTMLInputElement>) {
    setUploading(true);
    const files = event.currentTarget.files;
    if (files != null && files[0] != null) {
      const image = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const profilePicture = await addProfilePicture(
          user.username,
          reader.result as string
        );
        popupState.close();
        setUploading(false);
        setUser({ ...user, profilePicture: profilePicture.data });
      };
      reader.readAsDataURL(image);
    }
  }

  async function handleRemovePicture() {
    setRemoving(true);
    await deleteProfilePicture(user.username);
    popupState.close();
    setUser({ ...user, profilePicture: undefined });
    setRemoving(false);
  }

  return (
    <Paper style={{ padding: "4px 8px" }}>
      <Grid container>
        <Grid item>
          <AddUserButton
            currentList={renderedList}
            onClick={onAddUserButtonClick}
          />
        </Grid>
        <Grid item xs />
        <Grid item>
          <Tooltip
            title={`Logged in as ${user.firstName} ${user.lastName} (${user.username})`}
          >
            <IconButton {...bindTrigger(popupState)}>
              <UserIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Log out">
            <IconButton
              onClick={() => {
                setUser(undefined);
                localStorage.removeItem("token");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu
        disableBackdropClick={uploading}
        {...bindMenu(popupState)}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <input
          id="profile_picture"
          style={{ display: "none" }}
          type="file"
          onInput={handleImageSelected}
        />
        <MenuItem
          disabled={uploading}
          onClick={() => document.getElementById("profile_picture")!.click()}
        >
          {user.profilePicture != null
            ? "Change profile picture"
            : "Add profile picture"}
          {uploading && (
            <CircularProgress size={24} style={{ marginLeft: 8 }} />
          )}
        </MenuItem>
        {user.profilePicture != null && (
          <MenuItem disabled={uploading} onClick={handleRemovePicture}>
            Remove profile picture
            {removing && (
              <CircularProgress size={24} style={{ marginLeft: 8 }} />
            )}
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}

export default UserControlScreen;
