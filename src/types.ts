export type User = { id: string } & UserInfo;

export type UserInfo = {
  username: string;
  age: number;
  hobbies: string[];
};
