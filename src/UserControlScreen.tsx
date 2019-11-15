import { Grid, Paper, Typography } from "@material-ui/core";

import React from "react";
import { getUser } from "./api/API";

function UserControlScreen(props: {}) {
  return (
    <Grid>
      <Paper>
        <Typography>"HELLO THERE, DED"</Typography>
      </Paper>
    </Grid>
  );
}

export default UserControlScreen;
