import { User } from "./user";

export interface Message {
  id: string;
  user: User;
  sentAt: Date;
  text: string;
  groupName?: string;
  pending?: boolean;
}
