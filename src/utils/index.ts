import { IncomingMessage, ServerResponse } from 'http';
import { promises as fsPromises } from 'fs';
import path from 'path';

import { User } from '../types';

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
  const pathToDb = path.resolve(__dirname, '../db/users.json');

  try {
    const users = await fsPromises.readFile(pathToDb, 'utf8');
    return JSON.parse(users);
  } catch (error) {
    throw new Error('Error reading users file');
  }
}

export async function writeUsersFile(users: { data: User[] }): Promise<void> {
  const pathToDb = path.resolve(__dirname, '../db/users.json');

  try {
    await fsPromises.writeFile(pathToDb, JSON.stringify(users, null, 2));
  } catch (error) {
    throw new Error('Error writing to users file');
  }
}

export function parsePostData(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function sendResponseMessage(res: ServerResponse, statusCode: number, message: string) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
}

export function sendResponseUserData(
  res: ServerResponse,
  statusCode: number,
  user: { data: User[] } | User,
) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
}
