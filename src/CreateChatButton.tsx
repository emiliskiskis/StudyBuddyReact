import { IconButton, Tooltip } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import { ListView } from "./UserControlScreen";
import React from "react";

function CreateChatButton(props: {
  currentList: ListView;
  onClick: () => any;
}) {
  const { currentList, onClick } = props;

  return (
    <Tooltip title="Start a chat">
      <IconButton
        onClick={onClick}
        style={{
          transform: currentList !== ListView.Chat ? "rotate(45deg)" : "",
          transition: "transform 300ms ease"
        }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
}

export default CreateChatButton;
