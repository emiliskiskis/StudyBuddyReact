import "./App.css";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { UserContainer, useUser } from "./containers/UserContainer";
import { authenticateLocally, getProfilePicture } from "./api/API";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { SnackbarProvider } from "notistack";
import UserControlScreen from "./UserControlScreen";

enum View {
  Login,
  Register,
  UserLanding,
  UserList
}

const theme = createMuiTheme({
  overrides: {
    MuiIconButton: {
      root: {
        padding: 8
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
        fontSize: "0.85em"
      }
    }
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <UserContainer.Provider value={useUser()}>
          <Main />
        </UserContainer.Provider>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

function Main() {
  const [currentComponent, setCurrentComponent] = useState<View>(View.Login);
  const [pendingToken, setPendingToken] = useState<boolean>(true);

  const { user, setUser } = useContext(UserContainer);

  function handleSuccessfulLogin() {
    setCurrentComponent(View.UserLanding);
  }

  function handleRegisterButtonPressed() {
    setCurrentComponent(View.Register);
  }

  function handleSuccessfulRegister() {
    setCurrentComponent(View.Login);
  }

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    authenticateLocally()
      .then(user => {
        setUser(user);
        if (user != null) {
          getProfilePicture(user.username)
            .then(profilePicture => {
              setUser({ ...user, profilePicture: profilePicture.data });
            })
            .finally(() => {
              setCurrentComponent(View.UserLanding);
              setPendingToken(false);
            });
        } else {
          setPendingToken(false);
        }
      })
      .catch(error => {
        console.log(error);
        setPendingToken(false);
      });
  }, [setPendingToken, setUser]);

  useEffect(() => {
    if (!pendingToken && user == null) {
      setCurrentComponent(View.Login);
    }
  }, [pendingToken, user]);

  return (
    <>
      {!pendingToken && (
        <>
          {currentComponent === View.Login && (
            <LoginScreen
              onRegisterButtonPressed={handleRegisterButtonPressed}
              onSuccessfulLogin={handleSuccessfulLogin}
            />
          )}
          {currentComponent === View.Register && (
            <RegisterScreen onSuccessfulRegister={handleSuccessfulRegister} />
          )}
          {user != null && (
            <>
              {currentComponent === View.UserLanding && <UserControlScreen />}
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
