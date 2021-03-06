import { User } from "./user";

export interface Message {
  user: User;
  sentAt: Date;
  text: string;
  chatId?: string;
  tempId?: number;
}
