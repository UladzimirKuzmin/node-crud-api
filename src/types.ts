import { v4 } from 'uuid';

export type User = {
  id: typeof v4;
  username: string;
  age: number;
  hobbies: string[];
};
