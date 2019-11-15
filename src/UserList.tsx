import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Paper } from "@material-ui/core";
import React from "react";
import Typography from "@material-ui/core/Typography";

const users = [
  {
    username: "aaa",
    firstName: "bbb",
    lastName: "ccc"
  },
  {
    username: "ddd",
    firstName: "eee",
    lastName: "fff"
  }
];

function UserList() {
  return (
    <Paper style={{ height: "100%", position: "absolute", width: "100%" }}>
      <List dense>
        {users.map(user => (
          <ListItem key={user.username}>
            <ListItemText
              primary={user.username}
              secondary={user.firstName + " " + user.lastName}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default UserList;
