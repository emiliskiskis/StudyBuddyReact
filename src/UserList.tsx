import React, { useEffect, useState } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { User } from "./types/user";
import { getAllUsers } from "./api/API";

function UserList(props: { onUserSelect: (username: string) => any }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers().then(result => {
      setUsers(result);
    });
  }, []);

  return (
    <Paper style={{ height: "100%", width: "100%" }}>
      <List dense disablePadding style={{ overflowY: "auto", height: "100%" }}>
        {users.map(user => (
          <ListItem
            key={user.username}
            button
            onClick={() => props.onUserSelect(user.username)}
          >
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
