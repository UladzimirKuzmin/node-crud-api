import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { User } from '../types';

export function getFilename() {
  return fileURLToPath(import.meta.url);
}

export function extractUserIdAndBasePath(url: string): {
  userId?: string;
  basePath: string;
} {
  const id: string = url.replace('/api/users/', '');

  return url
    .split('/')
    .filter((part) => part.length > 0)
    .reduce(
      (acc: { userId?: string; basePath: string }, item: string) =>
        item === id
          ? { ...acc, userId: item }
          : { ...acc, basePath: [acc.basePath, item].join('/') },
      { basePath: '' },
    );
}

export async function readUsersFile(): Promise<{ data: User[] }> {
  const __filename = getFilename();
  const __dirname = path.dirname(__filename);
  const pathToDb = path.resolve(__dirname, '../db/users.json');

  try {
    const users = await fsPromises.readFile(pathToDb, 'utf8');
    return JSON.parse(users);
  } catch (error) {
    throw new Error('Error reading users file');
  }
}

export async function writeUsersFile(users: { data: User[] }): Promise<void> {
  const __filename = getFilename();
  const __dirname = path.dirname(__filename);
  const pathToDb = path.resolve(__dirname, '../db/users.json');

  try {
    await fsPromises.writeFile(pathToDb, JSON.stringify(users, null, 2));
  } catch (error) {
    throw new Error('Error writing to users file');
  }
}
