import { User } from "../types/user";
import axios from "axios";
import bcrypt from "bcryptjs";

let token: string;
const uri = "http://localhost:8080/api";

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
    password: bcrypt.hashSync(password, salt)
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

export async function getUser(username: string): Promise<User> {
  return (
    await axios.get<User>(`${uri}/users/${username}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
  ).data;
}
