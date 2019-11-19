import { User } from "./user";

export interface Chat {
  id: string;
  name?: string;
  users: User[];
}
