import { User } from "./user";

export interface Feedback {
  author: User;
  reviewee?: User;
  comment: string;
  rating: number;
}
