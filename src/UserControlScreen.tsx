import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { getGroupName, getUser } from "./api/API";

import Chat from "./Chat";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";
import UserList from "./UserList";

function UserControlScreen(props: {}) {
  const { user } = useContext<{ user: User | undefined; setUser: any }>(
    UserContainer
  );
  const [activeChat, setActiveChat] = useState<string>();

  async function handleUserListSelect(username: string) {
    if (user != null) {
      setActiveChat((await getGroupName(user!.username, username)).id);
    }
  }

  return (
    <Paper style={{ margin: 40, height: "calc(100vh - 80px)" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={3} style={{ maxHeight: "100%" }}>
          <UserList onUserSelect={handleUserListSelect} />
        </Grid>
        <Grid item xs={9}>
          {activeChat != null && user != null ? (
            <Chat activeChat={activeChat!} user={user!} />
          ) : (
            <Paper style={{ width: "100%", height: "100%" }} />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserControlScreen;
