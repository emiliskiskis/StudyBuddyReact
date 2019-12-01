import { Chat } from "./types/chat";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Message } from "./types/message";
import React from "react";
import { User } from "./types/user";
import { fade } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  active: {
    backgroundColor: fade(theme.palette.primary.light, 0.15)
  }
}));

function ChatList(props: {
  activeChat: string | undefined;
  chats: Chat[];
  lastMessages: { [chatId: string]: Message | undefined };
  user: User;
  onChatSelect: (username: string) => any;
}) {
  const classes = useStyles();

  const { activeChat, chats, lastMessages, onChatSelect } = props;

  function getChatName(chat: Chat): string {
    if (chat.name != null) return chat.name;
    const otherUsers = chat.users.filter(
      user => user.username !== props.user.username
    );
    if (otherUsers.length === 0) {
      return chat.users[0].firstName + " " + chat.users[0].lastName;
    } else {
      return otherUsers
        .map(user => user.firstName + " " + user.lastName)
        .join();
    }
  }

  function formatLastMessage(chatId: string): string {
    if (lastMessages[chatId] == null) return "";

    const { user, text } = lastMessages[chatId]!;
    const { username, firstName, lastName } = user;

    return `${
      props.user.username === username ? "You" : firstName + " " + lastName
    }: ${text}`;
  }

  return (
    <List dense disablePadding style={{ overflowY: "auto", height: "100%" }}>
      {chats.map((chat, index) => (
        <ListItem
          className={chat.id === activeChat ? classes.active : ""}
          key={index}
          button
          onClick={() => onChatSelect(chat.id)}
          divider
        >
          <ListItemText
            primary={getChatName(chat)}
            secondary={formatLastMessage(chat.id)}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ChatList;
