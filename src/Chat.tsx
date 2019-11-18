import * as signalr from "@microsoft/signalr";

import {
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

import { Message } from "./types/message";
import SendIcon from "@material-ui/icons/Send";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";
import { getAllChatMessages } from "./api/API";
import { makeStyles } from "@material-ui/styles";

function Chat(props: { activeChat: string; user: User }) {
  const [connection, setConnection] = useState<signalr.HubConnection>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>();

  const classes = useStyles();

  function sendMessage() {
    if (connection != null)
      if (connection!.state === signalr.HubConnectionState.Connected) {
        connection!.invoke("SendMessage", props.user.username, message);
      }
  }

  const getChatMessages = useCallback(async () => {
    const messages = await getAllChatMessages(props.activeChat);
    setMessages(
      messages.map(value => ({
        ...value,
        sentAt: new Date(value.sentAt)
      }))
    );
  }, [props.activeChat]);

  useEffect(() => {
    getChatMessages();

    var connection = new signalr.HubConnectionBuilder()
      .withUrl("http://buddiesofstudy.tk/chat")
      .build();

    connection.on(
      "ReceiveMessage",
      (
        username: string,
        groupName: string,
        messageText: string,
        sentAt: Date
      ) => {
        setMessages(prevMessages =>
          prevMessages.concat({
            user: { username, firstName: "titas", lastName: "kr" }, //TODO to get firstname and last name
            text: messageText,
            sentAt
          })
        );
      }
    );

    connection
      .start()
      .then(() => {
        setConnection(connection);
        connection.invoke("Connect", props.user.username, props.activeChat);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        console.log(connection);
      });

    return () => {
      connection.stop();
    };
  }, [getChatMessages]);

  return (
    <Paper style={{ margin: "8px 0", height: "100%", padding: "0 16px" }}>
      <Grid container direction="column" spacing={2} style={{ height: "100%" }}>
        <Grid item xs>
          <List style={{ padding: 16 }}>
            <Grid container spacing={2}>
              {messages.map((value, index) => (
                <Grid
                  item
                  container
                  xs={12}
                  justify={value.user != props.user ? "flex-start" : "flex-end"}
                >
                  <Grid item xs={8}>
                    <Paper
                      className={index % 2 === 1 ? classes.message : ""}
                      style={{ padding: 4 }}
                    >
                      <Typography>
                        {value.user.firstName} : {value.text}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </List>
        </Grid>
        <Grid item>
          <TextField
            value={message}
            onChange={event => {
              setMessage(event.target.value);
            }}
            variant="outlined"
            fullWidth
            placeholder="Message"
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    setMessage("");
                    sendMessage();
                  }}
                >
                  <SendIcon />
                </IconButton>
              )
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

const useStyles = makeStyles(theme => ({
  message: {
    backgroundColor: "#D0EFFE"
  }
}));

export default Chat;
