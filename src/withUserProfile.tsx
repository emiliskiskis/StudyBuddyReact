import React, { useState } from "react";

import { Dialog } from "@material-ui/core";
import UserProfile from "./UserProfile";

export default function withUserProfile<P>(Component: React.ComponentType<P>) {
  return function(props: P) {
    const [open, setOpen] = useState<boolean>(false);

    return (
      <>
        <Component
          {...props}
          onUserProfileOpen={() => {
            setOpen(true);
          }}
        />
        <Dialog open={open} maxWidth="xs" fullWidth>
          <UserProfile onClose={() => setOpen(false)} />
        </Dialog>
      </>
    );
  };
}
