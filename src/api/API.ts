import bcrypt, { genSalt } from "bcryptjs";

import { Message } from "../types/message";
import { User } from "../types/user";
import axios from "axios";
import { connect } from "http2";
import jwtDecode from "jwt-decode";

let token: string;
const uri = "http://buddiesofstudy.tk/api";

export async function getSalt(username: string): Promise<{ salt: string }> {
  return (await axios.get<{ salt: string }>(`${uri}/auth/salt/${username}`))
    .data;
}

export async function doLogin(
  username: string,
  password: string
): Promise<User> {
  const salt = (await getSalt(username)).salt;
  const response = await axios.post<{ token: string }>(`${uri}/auth/login`, {
    username,
    password: await bcrypt.hash(password, salt)
  });
  if (response.status !== 200) {
    throw response;
  } else {
    token = response.data.token;
    setUserToken();
    axios.defaults.headers.common = {
      Authorization: "Bearer " + token
    };
    return getUser(username);
  }
}

export async function doRegister(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<User> {
  const salt = await genSalt(12);
  const response = await axios.post(`${uri}/users`, {
    email,
    firstName,
    lastName,
    password: await bcrypt.hash(password, salt),
    salt,
    username
  });
  if (response.status !== 200) {
    throw response;
  } else return doLogin(username, password);
}

export async function getUser(username: string): Promise<User> {
  return (await axios.get<User>(`${uri}/users/${username}`)).data;
}

export async function getAllUsers(): Promise<User[]> {
  return (await axios.get<User[]>(`${uri}/users`)).data;
}

export async function getAllChatMessages(
  groupName: string
): Promise<Message[]> {
  return (await axios.get<Message[]>(`${uri}/chat/${groupName}/messages`)).data;
}

export function setUserToken() {
  localStorage.setItem("token", token);
}

export async function checkIfAuthenticated(): Promise<User | undefined> {
  if (localStorage.hasOwnProperty("token")) {
    token = localStorage.getItem("token")!;
    axios.defaults.headers.common = {
      Authorization: "Bearer " + token
    };
    return getUser(jwtDecode<{ nameid: string }>(token).nameid);
  } else {
    return undefined;
  }
}

export async function getGroupName(username: string, connectTo: string) {
  return (
    await axios.post<{ id: string }>(`${uri}/chat`, {
      username,
      connectTo
    })
  ).data;
}
