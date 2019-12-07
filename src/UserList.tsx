import React, { useEffect, useState } from "react";

import { LinearProgress } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { User } from "./types/user";
import { getAllUsers } from "./api/API";

function UserList(props: {
  excludedUsers?: string[];
  onUserSelect: (username: string) => any;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);

  const { excludedUsers = [], onUserSelect } = props;

  useEffect(() => {
    getAllUsers().then(users => {
      setUsers(users);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading && <LinearProgress />}
      <List dense disablePadding style={{ overflowY: "auto", height: "100%" }}>
        {users
          .filter(user => !excludedUsers.includes(user.username))
          .map(user => (
            <ListItem
              key={user.username}
              button
              onClick={() => onUserSelect(user.username)}
            >
              <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            </ListItem>
          ))}
      </List>
    </>
  );
}

export default UserList;
