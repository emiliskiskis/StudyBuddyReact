import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import React, { useContext } from "react";

import { UserContainer } from "./containers/UserContainer";

function UserProfile() {
  const { user } = useContext(UserContainer);
  function onUpdateClick() {}
  function onBackClick() {}

  return (
    <div style={{ margin: 8 }}>
      <Paper style={{ padding: 8 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography>{user.username}</Typography>
          </Grid>
          <Grid item>
            {user.profilePicture != null && (
              <img src={user.profilePicture} alt="" style={{ width: "100%" }} />
            )}
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Email"
              defaultValue={user.email}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="First name"
              defaultValue={user.firstName}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Last name"
              defaultValue={user.lastName}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Current password"
              type="password"
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="New password"
              type="password"
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Repeat new password"
              type="password"
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onUpdateClick()}
            >
              Save changes
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onBackClick()}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default UserProfile;
