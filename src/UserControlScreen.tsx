import { Grid, Paper, Typography } from "@material-ui/core";

import Chat from "./Chat";
import React from "react";
import UserList from "./UserList";
import { getUser } from "./api/API";

function UserControlScreen(props: {}) {
  return (
    <Grid container style={{ padding: 40, minHeight: "100vh" }}>
      <Grid item xs={3}>
        <UserList />
      </Grid>
      <Grid item xs={9}>
        <Chat />
      </Grid>
    </Grid>
  );
}

export default UserControlScreen;
