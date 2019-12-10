import React, { useState } from "react";

import { Dialog } from "@material-ui/core";
import { User } from "./types/user";
import UserProfile from "./UserProfile";

export default function withUserProfile<P>(Component: React.ComponentType<P>) {
  return function(props: P) {
    const [open, setOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    return (
      <>
        <Component
          {...props}
          onUserProfileOpen={(event, user: User) => {
            setOpen(true);
            setUser(user);
          }}
        />
        <Dialog open={open} maxWidth="xs" fullWidth>
          <UserProfile onClose={() => setOpen(false)} user={user!} />
        </Dialog>
      </>
    );
  };
}
