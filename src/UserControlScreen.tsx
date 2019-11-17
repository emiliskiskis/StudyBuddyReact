import { Grid, Paper, Typography } from "@material-ui/core";

import Chat from "./Chat";
import React from "react";
import UserList from "./UserList";
import { getUser } from "./api/API";

function UserControlScreen(props: {}) {
  return (
    <Paper style={{ margin: 40, height: "calc(100vh - 80px)" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={3}>
          <UserList />
        </Grid>
        <Grid item xs={9}>
          <Chat />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserControlScreen;
