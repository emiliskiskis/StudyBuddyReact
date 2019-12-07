import {
  Avatar,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

import { Message } from "./types/message";
import SendIcon from "@material-ui/icons/Send";
import { User } from "./types/user";
import { makeStyles } from "@material-ui/styles";

function ChatScreen(props: {
  activeChat: string;
  messages: Message[];
  user: User;
  onMessageSend: (
    username: string,
    chatId: string,
    message: string
  ) => Promise<any>;
}) {
  const classes = useStyles();

  const [message, setMessage] = useState<string>();

  const { activeChat, messages, user, onMessageSend } = props;

  const messageListRef = useRef<HTMLUListElement>(null);

  async function sendMessage() {
    if (message != null && message.trim() !== "") {
      try {
        await onMessageSend(user.username, activeChat, message);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    const messageList = messageListRef!.current!;
    messageList.scrollTop = messageList.scrollHeight - messageList.clientHeight;
  }, [props.messages]);

  return (
    <Paper style={{ margin: "8px 0", height: "100%", padding: "0 16px" }}>
      <Grid container direction="column" spacing={2} style={{ height: "100%" }}>
        <Grid item xs style={{ maxHeight: "calc(100% - 73px)" }}>
          <List
            ref={messageListRef}
            style={{ padding: 8, overflowY: "auto", height: "100%" }}
          >
            <Grid container direction="column" spacing={2}>
              {messages.length === 0 && (
                <Typography align="center" color="textSecondary">
                  No messages yet.
                </Typography>
              )}
              {messages.map((message, index) => (
                <Grid
                  key={index}
                  container
                  item
                  justify={
                    message.user.username !== props.user.username
                      ? "flex-start"
                      : "flex-end"
                  }
                >
                  <Grid
                    alignItems="center"
                    container
                    direction={
                      message.user.username !== props.user.username
                        ? "row"
                        : "row-reverse"
                    }
                    item
                    spacing={1}
                  >
                    <Grid item>
                      <Tooltip
                        title={
                          message.user.firstName + " " + message.user.lastName
                        }
                        PopperProps={{
                          placement: "top"
                        }}
                        TransitionProps={{
                          enter: true,
                          exit: true
                        }}
                      >
                        <Avatar>
                          {message.user.firstName.substring(0, 1) +
                            message.user.lastName.substring(0, 1)}
                        </Avatar>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Paper
                        className={
                          message.user.username !== props.user.username
                            ? classes.message
                            : ""
                        }
                        style={{ padding: "4px 8px" }}
                      >
                        <Typography
                          color={
                            message.tempId == null
                              ? "textPrimary"
                              : "textSecondary"
                          }
                        >
                          {message.text}
                        </Typography>
                      </Paper>
                    </Grid>
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
            margin="dense"
            multiline
            onKeyDown={event => {
              if (!event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                setMessage("");
                sendMessage();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    setMessage("");
                    sendMessage();
                  }}
                  style={{ margin: -4, padding: 4 }}
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

export default ChatScreen;
