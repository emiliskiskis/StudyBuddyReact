import "./App.css";

import React, { useContext, useEffect, useState } from "react";
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
  return (
    <SnackbarProvider>
      <UserContainer.Provider value={useUser()}>
        <Main />
      </UserContainer.Provider>
    </SnackbarProvider>
  );
}

function Main() {
  const [currentComponent, setCurrentComponent] = useState<PageStates>(
    PageStates.SignInPage
  );
  const { setUser } = useContext(UserContainer);

  function handleRegisterButtonPressed() {
    setCurrentComponent(PageStates.RegisterPage);
  }

  function handleSuccessfulLogin() {
    setCurrentComponent(PageStates.UserLandingPage);
  }

  useEffect(() => {
    checkIfAuthenticated().then(user => {
      setUser(user);
      if (user != null) {
        setCurrentComponent(PageStates.UserLandingPage);
        console.log(user);
      }
    });
  }, []);

  return (
    <>
      {currentComponent === PageStates.UserLandingPage && <UserControlScreen />}
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
    </>
  );
}

export default App;
