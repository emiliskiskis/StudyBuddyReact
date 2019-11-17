import * as signalr from "@aspnet/signalr";

import { Grid, List, Paper, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { Field } from "formik";
import { Message } from "./types/message";
import { getAllChatMessages } from "./api/API";
import { makeStyles } from "@material-ui/styles";

function Chat(props: {}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const classes = useStyles();

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
                  justify={index % 2 === 0 ? "flex-start" : "flex-end"}
                >
                  <Grid item xs={8}>
                    <Paper
                      className={index % 2 == 1 ? classes.message : ""}
                      style={{ padding: 4 }}
                    >
                      <Typography>
                        {value.user.firstName} {value.user.lastName}:{" "}
                        {value.text}
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
            variant="outlined"
            fullWidth
            placeholder="Message"
            margin="normal"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

const useStyles = makeStyles(theme => ({
  message: {
    backgroundColor: "#D0EFFE" //theme.palete.primary.main
  }
}));

export default Chat;
