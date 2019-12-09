import {
  ConnectOther,
  MessageSuccess,
  ReceiveChat,
  ReceiveMessage,
  SendMessage
} from "./api/SignalR";
import {
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography
} from "@material-ui/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  addUserToChat,
  getAllUserChats,
  getChatMessages,
  getGroupName,
  getProfilePicture
} from "./api/API";

import { Chat } from "./types/chat";
import ChatList from "./ChatList";
import ChatScreen from "./ChatScreen";
import { Message } from "./types/message";
import { ProfilePicture } from "./types/profilePicture";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";
import UserControlFooter from "./UserControlFooter";
import UserList from "./UserList";

export enum ListView {
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
  const [profilePictures, setProfilePictures] = useState<{
    [username: string]: ProfilePicture;
  }>({});
  const [renderedList, setRenderedList] = useState<ListView>(ListView.Chat);

  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const profilePicturesRef = useRef(profilePictures);
  useEffect(() => {
    profilePicturesRef.current = profilePictures;
  }, [profilePictures]);

  const getUserProfilePictures = useCallback(
    (users: User[]) => {
      users
        .map(user => user.username)
        .filter(
          (username, index) =>
            username !== user.username &&
            users.findIndex(user => user.username === username) === index
        )
        .forEach(username => {
          if (profilePicturesRef.current[username] == null) {
            getProfilePicture(username).then(profilePicture => {
              setProfilePictures(prevProfilePictures => ({
                ...prevProfilePictures,
                [username]: profilePicture
              }));
            });
          }
        });
    },
    [profilePicturesRef, user.username]
  );

  async function createNewChat(connectTo: string) {
    const newChat = await getGroupName(user.username, connectTo);
    getUserProfilePictures(newChat.users);

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
      .withUrl("http://buddiesofstudy.tk/chat")
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
    setChats([]);
    setLoading(true);
    if (user.profilePicture != null) {
      setProfilePictures({ [user.username]: user.profilePicture });
    }
    getAllUserChats(user.username).then(chats => {
      chats.forEach(chat => getUserProfilePictures(chat.users));
      setChats(chats);
      setLoading(false);
    });
  }, [getUserProfilePictures, user.profilePicture, user.username]);

  return (
    <Paper style={{ margin: 40, height: "calc(100vh - 80px)" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs style={{ maxHeight: "100%", maxWidth: 400 }}>
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
                <UserControlFooter
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
        <Grid item xs style={{ maxHeight: "100%" }}>
          {activeChat != null && user != null ? (
            <ChatScreen
              activeChat={activeChat}
              messages={messages[activeChat]}
              profilePictures={profilePictures}
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

export default UserControlScreen;
