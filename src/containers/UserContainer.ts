import { createContext, useState } from "react";

import { User } from "../types/user";

export function useUser() {
  const [user, setUser] = useState<User>();
  return { user, setUser };
}

export const UserContainer = createContext<any>(null);
