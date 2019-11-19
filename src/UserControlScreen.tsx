import {
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography
} from "@material-ui/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { getAllUserChats, getChatMessages, getGroupName } from "./api/API";

import AddIcon from "@material-ui/icons/Add";
import { Chat } from "./types/chat";
import ChatList from "./ChatList";
import ChatScreen from "./ChatScreen";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { Message } from "./types/message";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";

function UserControlScreen() {
  const { user, setUser } = useContext<{
    user: User;
    setUser: (
      user:
        | (User | undefined)
        | ((prevUser: User | undefined) => User | undefined)
    ) => void;
  }>(UserContainer);
  const [activeChat, setActiveChat] = useState<string>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [connection, setConnection] = useState<HubConnection>();
  const [loadingChats, setLoadingChats] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});

  async function createNewChat(connectTo: string) {
    const newChat = await getGroupName(user.username, connectTo);

    connection!.invoke("ConnectOther", connectTo, newChat.id);
    setChats(prevChats => prevChats.concat(newChat));
  }

  const receiveNewChat = useCallback(
    async (username: string) => {
      console.log("invoked");
      setLoadingChats(true);
      const newChat = await getGroupName(user.username, username);
      setChats(prevChats => prevChats.concat(newChat));
      setLoadingChats(false);
      return newChat;
    },
    [user.username]
  );

  const handleReceiveMessage = useCallback(
    async (
      username: string,
      chatId: string,
      messageText: string,
      sentAt: string
    ) => {
      const chat = chats.find(chat => chat.id === chatId);
      if (chat != null) {
        const sentUser = chat.users.find(user => user.username === username);
        addMessage(chatId, username, sentUser, messageText, sentAt);
      } else {
        const newChat = await receiveNewChat(username);
        const sentUser = newChat.users.find(user => user.username === username);
        addMessage(chatId, username, sentUser, messageText, sentAt);
      }
    },
    [receiveNewChat, chats]
  );

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://buddiesofstudy.tk/chat")
      .build();

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("ReceiveChat", receiveNewChat);

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
  }, [receiveNewChat, handleReceiveMessage, user.username]);

  useEffect(() => {
    setLoadingChats(true);
    getAllUserChats(user.username).then(chats => {
      setChats(chats);
      setLoadingChats(false);
    });
  }, [user.username]);

  function addMessage(
    chatId: string,
    username: string,
    sentUser: User | undefined,
    text: string,
    sentAt: string
  ) {
    setMessages(prevMessages => ({
      ...prevMessages,
      [chatId]: prevMessages[chatId].concat({
        user: {
          username: username,
          firstName: sentUser != null ? sentUser.firstName : "",
          lastName: sentUser != null ? sentUser.lastName : ""
        },
        text,
        sentAt: new Date(sentAt)
      })
    }));
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
    if (messages[id] == null) await getActiveChatMessages(id);
    setActiveChat(id);
  }

  function handleMessageSend(
    username: string,
    chatId: string,
    messageText: string
  ) {
    return connection!.invoke("SendMessage", username, chatId, messageText);
  }

  return (
    <Paper style={{ margin: 40, height: "calc(100vh - 80px)" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={3} style={{ maxHeight: "100%" }}>
          <Paper style={{ height: "100%", width: "100%" }}>
            <Grid container direction="column" style={{ height: "100%" }}>
              <Grid item>
                <Typography variant="h5" style={{ padding: "8px 16px" }}>
                  Chats
                </Typography>
              </Grid>
              <Grid item>
                <Divider />
              </Grid>
              <Grid item xs>
                <ChatList
                  chats={chats}
                  lastMessages={Object.assign(
                    {},
                    ...Object.keys(messages).map(key => ({
                      [key]: messages[key][messages[key].length - 1]
                    }))
                  )}
                  user={user}
                  onChatSelect={handleChatSelect}
                />
              </Grid>
              {loadingChats && (
                <Grid item>
                  <LinearProgress />
                </Grid>
              )}
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <Paper style={{ padding: "4px 8px" }}>
                  <Grid container>
                    <Grid item>
                      <IconButton style={{ padding: 8 }}>
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs />
                    <Grid item>
                      <Tooltip title="Log out">
                        <IconButton
                          onClick={() => {
                            setUser(undefined);
                            localStorage.removeItem("token");
                          }}
                          style={{ padding: 8 }}
                        >
                          <LogoutIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Paper>
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

export default UserControlScreen;
