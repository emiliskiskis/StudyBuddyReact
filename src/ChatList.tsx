import { Chat } from "./types/chat";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Message } from "./types/message";
import React from "react";
import { User } from "./types/user";

function UserList(props: {
  chats: Chat[];
  lastMessages: { [chatId: string]: Message };
  user: User;
  onChatSelect: (username: string) => any;
}) {
  const { chats, lastMessages, onChatSelect } = props;

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

    const { user, text } = lastMessages[chatId];
    const { username, firstName, lastName } = user;

    return `${
      props.user.username === username ? "You" : firstName + " " + lastName
    }: ${text}`;
  }

  return (
    <List dense disablePadding style={{ overflowY: "auto", height: "100%" }}>
      {chats.map(chat => (
        <ListItem
          key={chat.users[0].username}
          button
          onClick={() => onChatSelect(chat.id)}
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

export default UserList;
