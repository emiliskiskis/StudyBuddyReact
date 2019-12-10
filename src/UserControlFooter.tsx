import {
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip
} from "@material-ui/core";
import { addProfilePicture, deleteProfilePicture } from "./api/API";
import {
  bindMenu,
  bindTrigger,
  usePopupState
} from "material-ui-popup-state/hooks";
import { useContext, useState } from "react";

import CreateChatButton from "./CreateChatButton";
import { ListView } from "./UserControlScreen";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import React from "react";
import { StateSetter } from "./api/SignalR";
import { User } from "./types/user";
import { UserContainer } from "./containers/UserContainer";
import UserIcon from "@material-ui/icons/Person";
import withUserProfile from "./withUserProfile";

function UserControlFooter(props: {
  renderedList: ListView;
  onAddUserButtonClick: () => any;
  onUserProfileOpen?: (event: Event, user: User) => void;
}) {
  const popupState = usePopupState({ variant: "popover" });
  const [removing, setRemoving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const { user, setUser } = useContext<{
    user: User;
    setUser: StateSetter<User | undefined>;
  }>(UserContainer);
  const { renderedList, onAddUserButtonClick: onCreateChatButtonClick } = props;

  function handleImageSelected(event: React.FormEvent<HTMLInputElement>) {
    setUploading(true);
    const files = event.currentTarget.files;
    if (files != null && files[0] != null) {
      const image = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const profilePicture = await addProfilePicture(
          user.username,
          reader.result as string
        );
        popupState.close();
        setUploading(false);
        setUser({ ...user, profilePicture });
      };
      reader.readAsDataURL(image);
    }
  }

  async function handleRemovePicture() {
    setRemoving(true);
    await deleteProfilePicture(user.username);
    popupState.close();
    setUser({ ...user, profilePicture: undefined });
    setRemoving(false);
  }

  async function handleOpenProfile(event) {
    popupState.close();
    if (props.onUserProfileOpen != null) props.onUserProfileOpen(event, user);
  }

  return (
    <Paper style={{ padding: "4px 8px" }}>
      <Grid container>
        <Grid item>
          <CreateChatButton
            currentList={renderedList}
            onClick={onCreateChatButtonClick}
          />
        </Grid>
        <Grid item xs />
        <Grid item>
          <Tooltip
            title={`Logged in as ${user.firstName} ${user.lastName} (${user.username})`}
          >
            <IconButton {...bindTrigger(popupState)}>
              <UserIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Log out">
            <IconButton
              onClick={() => {
                setUser(undefined);
                localStorage.removeItem("token");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu
        disableBackdropClick={uploading}
        {...bindMenu(popupState)}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <input
          id="profile_picture"
          style={{ display: "none" }}
          type="file"
          onInput={handleImageSelected}
        />
        <MenuItem onClick={handleOpenProfile}>My profile</MenuItem>
        <MenuItem
          disabled={uploading}
          onClick={() => document.getElementById("profile_picture")!.click()}
        >
          {user.profilePicture != null
            ? "Change profile picture"
            : "Add profile picture"}
          {uploading && (
            <CircularProgress size={24} style={{ marginLeft: 8 }} />
          )}
        </MenuItem>
        {user.profilePicture != null && (
          <MenuItem disabled={uploading} onClick={handleRemovePicture}>
            Remove profile picture
            {removing && (
              <CircularProgress size={24} style={{ marginLeft: 8 }} />
            )}
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}

export default withUserProfile(UserControlFooter);
