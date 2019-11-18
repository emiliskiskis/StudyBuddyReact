import "./App.css";

import React, { useEffect, useState } from "react";
import { UserContainer, useUser } from "./containers/UserContainer";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { SnackbarProvider } from "notistack";
import UserControlScreen from "./UserControlScreen";
import UserList from "./UserList";
import { checkIfAuthenticated } from "./api/API";

enum PageStates {
  SignInPage,
  RegisterPage,
  UserLandingPage,
  UserListPage
}

function App() {
  const [currentComponent, setCurrentComponent] = useState<PageStates>(
    PageStates.SignInPage
  );

  function handleRegisterButtonPressed() {
    setCurrentComponent(PageStates.RegisterPage);
  }

  function handleSuccessfulLogin() {
    setCurrentComponent(PageStates.UserLandingPage);
  }

  useEffect(() => {
    if (checkIfAuthenticated()) {
      setCurrentComponent(PageStates.UserLandingPage);
    }
  }, []);

  return (
    <SnackbarProvider>
      <UserContainer.Provider value={useUser()}>
        {currentComponent === PageStates.UserLandingPage && (
          <UserControlScreen />
        )}
        }
        {currentComponent === PageStates.SignInPage && (
          <LoginScreen
            onRegisterButtonPressed={handleRegisterButtonPressed}
            onSuccessfulLogin={handleSuccessfulLogin}
          />
        )}
        {currentComponent === PageStates.RegisterPage && (
          <RegisterScreen onLoginButtonPressed={handleSuccessfulLogin} />
        )}
      </UserContainer.Provider>
    </SnackbarProvider>
  );
}

export default App;
