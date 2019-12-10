import { doLogin, doRegister } from "./API";

test("Test if jest works at all", () => {
  expect(2 + 2).toBe(4);
});

test("logging in with an empty username and password returns error 400", () => {
  const mockUser = {
    username: "",
    password: ""
  };
  const mockError = {
    errorStatus: 400
  };
  return doLogin(mockUser.username, mockUser.password).catch(e => {
    expect(e.response.status).toEqual(mockError.errorStatus);
  });
});

test("register an empty user returns http status code 400", () => {
  const mockUser = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  };
  const mockError = {
    errorStatus: 400
  };
  return doRegister(
    mockUser.username,
    mockUser.password,
    mockUser.firstName,
    mockUser.lastName,
    mockUser.email
  ).catch(e => {
    expect(e.response.status).toEqual(mockError.errorStatus);
  });
});
