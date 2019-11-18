import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";

import Chat from "./Chat";
import { UserContainer } from "./containers/UserContainer";
import UserList from "./UserList";
import { getUser } from "./api/API";

function UserControlScreen(props: {}) {
  const { user } = useContext(UserContainer);
  const [activeChat, setActiveChat] = useState<string>();

  async function handleUserListSelect(username: string) {
    alert(username);
    //setActiveChat(await getGroupName(user.username, username));
  }

  return (
    <Paper style={{ margin: 40, height: "calc(100vh - 80px)" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={3}>
          <UserList onUserSelect={handleUserListSelect} />
        </Grid>
        <Grid item xs={9}>
          <Chat />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserControlScreen;
