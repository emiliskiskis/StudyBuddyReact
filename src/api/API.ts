import bcrypt, { genSalt } from "bcryptjs";

import { User } from "../types/user";
import axios from "axios";

let token: string;
const uri = "http://78.56.77.83:8080/api"; //TODO : nustatyti valid serviso adresa

export async function getSalt(username: string): Promise<{ salt: string }> {
  return (await axios.get<{ salt: string }>(`${uri}/users/${username}/salt`))
    .data;
}

export async function doLogin(
  username: string,
  password: string
): Promise<User> {
  const salt = (await getSalt(username)).salt;
  const response = await axios.post<{ token: string }>(`${uri}/login`, {
    username,
    password: await bcrypt.hash(password, salt)
  });
  if (response.status !== 200) {
    throw response;
  } else {
    token = response.data.token;
    axios.defaults = {
      headers: {
        Authorization: "Bearer " + token
      }
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
  return (
    await axios.get<User>(`${uri}/users/${username}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
  ).data;
}
