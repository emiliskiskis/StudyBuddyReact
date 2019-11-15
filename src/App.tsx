import "./App.css";

import React, { useState } from "react";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { SnackbarProvider } from "notistack";
import UserControlScreen from "./UserControlScreen";
import UserList from "./UserList";

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

  function handleLoginButtonPressed() {
    setCurrentComponent(PageStates.UserLandingPage);
  }

  return (
    <SnackbarProvider>
      <>
        {currentComponent === PageStates.SignInPage && (
          <LoginScreen
            onRegisterButtonPressed={handleRegisterButtonPressed}
            onLoginButtonPressed={handleLoginButtonPressed}
          />
        )}
        {currentComponent === PageStates.RegisterPage && (
          <RegisterScreen onLoginButtonPressed={handleLoginButtonPressed} />
        )}
        {currentComponent === PageStates.UserLandingPage && (
          <UserControlScreen />
        )}
        {currentComponent === PageStates.UserListPage && <UserList />}
      </>
    </SnackbarProvider>
  );
}

export default App;
