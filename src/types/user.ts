export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
}

const a: User = {
  username: "emilis",
  firstName: "Onig",
  lastName: "egwnoig",
  email: "tgqewhnq3i"
};

a.email?.replace(/.*/, "");
