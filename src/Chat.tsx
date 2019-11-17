import * as signalr from "@aspnet/signalr";

import React, { useEffect, useState } from "react";

import { Paper } from "@material-ui/core";

function Chat(props: {}) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
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
        setMessages(messages.concat(`${username}: ${messageText}`));
      }
    );

    connection
      .start()
      .then(() => {})
      .catch(err => {
        return console.error(err.toString());
      });
  }, []);

  return <Paper style={{ height: "100%", width: "100%" }}></Paper>;
}

export default Chat;
