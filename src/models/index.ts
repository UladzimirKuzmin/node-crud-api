import { v4 as uuidV4 } from 'uuid';
import { readUsersFile, writeUsersFile } from '../utils';
import { User } from '../types';

export async function findUsers(): Promise<{ data: User[] }> {
  return await readUsersFile();
}

export async function findUserById(userId: string): Promise<User | undefined> {
  try {
    const users = await readUsersFile();
    return users?.data.find((user) => user.id === userId);
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(body: string): Promise<User | undefined> {
  try {
    const newUser: User = { id: uuidV4(), ...JSON.parse(body) };
    const users = await readUsersFile();

    await writeUsersFile({ data: [...users.data, newUser] });
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(userId: string, body: string): Promise<User | undefined> {
  try {
    const users = await readUsersFile();
    const index = users?.data.findIndex((user) => user.id === userId);

    if (index !== -1) {
      const updatedUsers = users?.data.map((user, i) =>
        index === i ? { ...user, ...JSON.parse(body), id: userId } : user,
      );

      await writeUsersFile({ data: updatedUsers });
      console.log(updatedUsers[index]);
      return updatedUsers[index];
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(userId: string): Promise<User | undefined> {
  try {
    const users = await readUsersFile();
    const index = users.data.findIndex((user) => user.id === userId);

    if (index !== -1) {
      await writeUsersFile({ data: users.data.filter((user) => user.id !== userId) });
      return users.data[index];
    }
  } catch (error) {
    console.log(error);
  }
}
