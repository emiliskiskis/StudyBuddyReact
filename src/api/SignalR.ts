import { Chat } from "../types/chat";
import { HubConnection } from "@microsoft/signalr";
import { Message } from "../types/message";
import { getChat } from "./API";

// Server invocations

export function Connect(connection: HubConnection, username: string) {
  return connection.invoke("Connect", username);
}

export function ConnectOther(
  connection: HubConnection,
  username: string,
  chatId: string
) {
  return connection.invoke("ConnectOther", username, chatId);
}

export function SendMessage(
  connection: HubConnection,
  username: string,
  chatId: string,
  text: string,
  tempId: number
) {
  return connection.invoke("SendMessage", username, chatId, text, tempId);
}

// Client events

type StateSetter<T> = (t: T | ((prevT: T) => T)) => any;
type MessageState = { [chatId: string]: Message[] };

export const ReceiveChat = (
  setChats: StateSetter<Chat[]>,
  setLoading: StateSetter<boolean>
) => async (chatId: string) => {
  setLoading(true);
  try {
    const newChat = await getChat(chatId);
    setChats(prevChats => [...prevChats, newChat]);
  } catch (e) {
    setLoading(false);
    throw e;
  }
};

export const ReceiveMessage = (
  chats: React.MutableRefObject<Chat[]>,
  setMessages: StateSetter<MessageState>
) => async (username: string, chatId: string, text: string, sentAt: string) => {
  let chat = chats.current.find(chat => chat.id === chatId);
  if (chat == null) {
    chat = await getChat(chatId);
  }
  const user = chat.users.find(user => user.username === username)!;

  setMessages(prevMessages => {
    if (prevMessages[chatId] == null) {
      return {
        ...prevMessages,
        [chatId]: [
          {
            user,
            text,
            sentAt: new Date(sentAt)
          }
        ]
      };
    }

    return {
      ...prevMessages,
      [chatId]: prevMessages[chatId].concat({
        user,
        text,
        sentAt: new Date(sentAt)
      })
    };
  });
};

export const MessageSuccess = (setMessages: StateSetter<MessageState>) => (
  chatId: string,
  index: number
) => {
  setMessages(prevMessages => ({
    ...prevMessages,
    [chatId]: [
      ...prevMessages[chatId].slice(0, index),
      {
        ...prevMessages[chatId][index],
        tempId: undefined
      },
      ...prevMessages[chatId].slice(index + 1)
    ]
  }));
};
