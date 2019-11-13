import "./App.css";

import React, { useState } from "react";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import UserControlScreen from "./UserControlScreen";

enum PageStates {
  SignInPage,
  RegisterPage,
  UserLandingPage
}

const App: React.FC = () => {
  const [currentComponent, setCurrentComponent] = useState<PageStates>(
    PageStates.SignInPage
  );

  function handleRegisterButtonPressed() {
    setCurrentComponent(PageStates.RegisterPage);
  }

  return (
    <>
      {currentComponent === PageStates.SignInPage && (
        <LoginScreen onRegisterButtonPressed={handleRegisterButtonPressed} />
      )}
      {currentComponent === PageStates.RegisterPage && <RegisterScreen />}
      {currentComponent === PageStates.UserLandingPage && <UserControlScreen />}
    </>
  );
};

export default App;
