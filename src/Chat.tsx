import * as signalr from "@aspnet/signalr";

import { Grid, List, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { Message } from "./types/message";
import { getAllChatMessages } from "./api/API";

function Chat(props: {}) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    getAllChatMessages("8bcada60-5a00-437a-b42f-aa5e2e2aa24d").then(
      messages => {
        setMessages(
          messages.map(value => ({
            ...value,
            sentAt: new Date(value.sentAt)
          }))
        );
      }
    );

    var connection = new signalr.HubConnectionBuilder()
      .withUrl("http://78.56.77.83:8080/chat")
      .build();

    connection.on(
      "ReceiveMessage",
      (
        username: string,
        groupName: string,
        messageText: string,
        sentAt: Date
      ) => {
        setMessages(
          messages.concat({
            user: { username, firstName: "titas", lastName: "8======D" },
            text: messageText,
            groupName,
            sentAt
          })
        );
      }
    );

    connection
      .start()
      .then(() => {})
      .catch(err => {
        return console.error(err.toString());
      });
  }, []);

  return (
    <Paper style={{ height: "100%", width: "100%" }}>
      <List style={{ padding: 16 }}>
        <Grid container spacing={2}>
          {messages.map((value, index) => (
            <Grid item xs={12}>
              <Paper style={{ padding: 4 }}>
                <Typography>
                  {value.user.firstName} {value.user.lastName}: {value.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </List>
    </Paper>
  );
}

export default Chat;
