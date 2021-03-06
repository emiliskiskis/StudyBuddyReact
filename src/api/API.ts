import bcrypt, { genSalt, hash } from "bcryptjs";

import { Chat } from "../types/chat";
import { Feedback } from "../types/feedback";
import { Message } from "../types/message";
import { User } from "../types/user";
import axios from "axios";
import jwtDecode from "jwt-decode";

const client = axios.create({
  baseURL: "http://buddiesofstudy.tk/api/"
});

export async function getSalt(username: string): Promise<{ salt: string }> {
  return (await client.get<{ salt: string }>(`auth/salt/${username}`)).data;
}

export async function doLogin(
  username: string,
  password: string
): Promise<User> {
  const salt = (await getSalt(username)).salt;
  const response = await client.post<{ token: string }>("auth/login", {
    username,
    password: await bcrypt.hash(password, salt)
  });
  if (response.status !== 200) {
    throw response;
  } else {
    const token = response.data.token;
    setUserToken(token);
    client.defaults.headers.common = {
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
  const response = await client.post("users", {
    email,
    firstName,
    lastName,
    password: await hash(password, salt),
    salt,
    username
  });
  if (response.status !== 200) {
    throw response;
  }
  return response.data;
}

export async function updateUser(username: string, body: any) {
  return (await client.patch<User>(`users/${username}`, body)).data;
}

export async function getUser(username: string) {
  return (await client.get<User>(`users/${username}`)).data;
}

export async function getAllUsers() {
  return (await client.get<User[]>("users")).data;
}

export async function getAllUserChats(username: string) {
  return (await client.get<Chat[]>(`chat/${username}`)).data;
}

export async function getChat(chatId: string) {
  return (await client.get<Chat>(`chat/${chatId}`)).data;
}

export async function getChatMessages(groupName: string) {
  return (await client.get<Message[]>(`chat/${groupName}/messages`)).data;
}

export function setUserToken(token) {
  localStorage.setItem("token", token);
}

export async function authenticateLocally() {
  if (localStorage.hasOwnProperty("token")) {
    const token = localStorage.getItem("token")!;
    client.defaults.headers.common = {
      Authorization: "Bearer " + token
    };
    const decodedToken = jwtDecode<{
      exp: number;
      iat: number;
      nameid: string;
      nbf: number;
    }>(token);
    if (decodedToken.exp < new Date().getTime() / 1000) return undefined;
    else return getUser(decodedToken.nameid);
  } else {
    return undefined;
  }
}

export async function getGroupName(
  username: string,
  connectTo: string
): Promise<Chat> {
  return (
    await client.post<Chat>(`chat`, {
      username,
      connectTo
    })
  ).data;
}

export async function addUserToChat(chatId: string, username: string) {
  return (await client.post<Chat>(`chat/${chatId}`, { username })).data;
}

export async function addProfilePicture(
  username: string,
  profilePicture: string
) {
  return (
    await client.post<{ data: string }>(`users/${username}/picture`, {
      data: profilePicture
    })
  ).data;
}

export async function getProfilePicture(username: string) {
  return (await client.get<{ data: string }>(`users/${username}/picture`)).data;
}

export async function deleteProfilePicture(username: string) {
  return client.delete(`users/${username}/picture`);
}

export async function getUserFeedback(username: string) {
  return (await client.get<Feedback[]>(`feedback/${username}`)).data;
}
