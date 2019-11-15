import { Grid, Paper, Typography } from "@material-ui/core";

import React from "react";
import UserList from "./UserList";
import { getUser } from "./api/API";

function UserControlScreen(props: {}) {
  return (
    <div style={{ width: "20%", minHeight: "100vh", position: "relative" }}>
      <UserList />
    </div>
  );
}

export default UserControlScreen;
