import bcrypt, { genSalt } from "bcryptjs";

import { Message } from "../types/message";
import { User } from "../types/user";
import axios from "axios";

let token: string;
const uri = "http://172.24.1.245:8080/api"; //TODO : nustatyti valid serviso adresa

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
  return (await axios.get<Message[]>(`${uri}/chat/${groupName}`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })).data;
}

export function setUserToken() {
  localStorage.setItem("token", token);
}

export function checkIfAuthenticated() {
  if (localStorage.hasOwnProperty("token")) {
    token = localStorage.getItem("token")!;
    return true;
  } else {
    return false;
  }
}
