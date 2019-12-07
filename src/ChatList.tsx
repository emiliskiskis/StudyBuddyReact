import {
  IconButton,
  ListItemSecondaryAction,
  Tooltip,
  makeStyles
} from "@material-ui/core";
import React, { useContext, useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import { Chat } from "./types/chat";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Message } from "./types/message";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";
import { fade } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  active: {
    backgroundColor: fade(theme.palette.primary.light, 0.15)
  }
}));

function ChatList(props: {
  activeChat: string | undefined;
  chats: Chat[];
  lastMessages: { [chatId: string]: Message | undefined };
  onAddUserToChatSelect: (chat: Chat) => any;
  onChatSelect: (chatId: string) => any;
}) {
  const { user } = useContext(UserContainer);
  const { activeChat, chats, onAddUserToChatSelect, onChatSelect } = props;

  return (
    <List dense disablePadding>
      {chats.map((chat, index) => (
        <ChatListItem
          active={chat.id === activeChat}
          key={index}
          chat={chat}
          onAddUserToChatSelect={onAddUserToChatSelect}
          onChatSelect={onChatSelect}
        />
      ))}
      {user.profilePicture != null && (
        <img src={user.profilePicture} alt="" style={{ width: "100%" }} />
      )}
    </List>
  );
}

function ChatListItem(props: {
  active: boolean;
  chat: Chat;
  onAddUserToChatSelect: (chat: Chat) => any;
  onChatSelect: (chatId: string) => any;
}) {
  const classes = useStyles();
  const [hover, setHover] = useState<boolean>(false);
  const { user: currentUser } = useContext(UserContainer);

  const { active, chat, onAddUserToChatSelect, onChatSelect } = props;

  function getChatName(): string {
    if (chat.name != null) return chat.name;
    const otherUsers = chat.users.filter(
      user => user.username !== currentUser.username
    );
    if (otherUsers.length === 0) {
      return chat.users[0].firstName + " " + chat.users[0].lastName;
    } else {
      return otherUsers
        .map(user => user.firstName + " " + user.lastName)
        .join(", ");
    }
  }

  function formatLastMessage(): string {
    if (chat.lastMessage == null) return "";

    const { user, text } = chat.lastMessage!;
    const { username, firstName, lastName } = user;

    return `${
      currentUser.username === username ? "You" : firstName + " " + lastName
    }: ${text}`;
  }

  return (
    <ListItem
      className={active ? classes.active : ""}
      button
      onClick={() => onChatSelect(chat.id)}
      divider
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ListItemText primary={getChatName()} secondary={formatLastMessage()} />
      {hover && (
        <ListItemSecondaryAction
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Tooltip title="Add user to chat">
            <IconButton
              size="small"
              onClick={() => onAddUserToChatSelect(chat)}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export default ChatList;
