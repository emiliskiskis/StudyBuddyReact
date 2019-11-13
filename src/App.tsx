import "./App.css";

import React, { useState } from "react";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

enum PageStates {
  SignInPage,
  RegisterPage
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
    </>
  );
};

export default App;
