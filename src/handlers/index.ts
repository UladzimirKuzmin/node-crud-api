import { RequestListener } from 'node:http';
import { v4 as uuidV4, validate } from 'uuid';

import { extractUserIdAndBasePath, readUsersFile, writeUsersFile } from '../helpers';
import { User } from '../types';

export const handleUsers: RequestListener = async (req, res): Promise<void> => {
  const { userId } = extractUserIdAndBasePath(req.url || '');
  const method = req.method || 'GET';

  if (userId) {
    await userHandlers[method](req, res);
    return;
  }

  await usersHandlers[method](req, res);
};

export const handleUsersGet: RequestListener = async (req, res): Promise<void> => {
  try {
    const users = await readUsersFile();
    if (users) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(users));
    } else {
      handleNotFound(req, res);
    }
  } catch (error) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};

export const handleUsersPost: RequestListener = async (req, res): Promise<void> => {
  try {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    await new Promise((resolve) => {
      req.on('end', resolve);
    });

    const newUser: User = {
      id: uuidV4(),
      ...JSON.parse(body),
    };

    const users = await readUsersFile();

    await writeUsersFile({ data: [...users.data, newUser] });

    res.statusCode = 201;
    res.end(JSON.stringify(newUser));
  } catch (error) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};

export const handleUserGet: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId } = extractUserIdAndBasePath(req.url || '');
    const users = await readUsersFile();
    const user = users?.data.find((user) => user.id === userId);

    if (!validate(userId as string)) {
      res.statusCode = 400;
      res.end('Bad request.');
      return;
    }

    if (user) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    } else {
      handleNotFound(req, res);
    }
  } catch (error) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};

export const handleUserPut: RequestListener = async (_, res): Promise<void> => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Get all users!');
};

export const handleUserDelete: RequestListener = async (_, res): Promise<void> => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Get all users!');
};

export const handleNotFound: RequestListener = (_, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Resource is not found!');
};

const userHandlers: Record<string, RequestListener> = {
  GET: handleUserGet,
  PUT: handleUserPut,
  DELETE: handleUserDelete,
};

const usersHandlers: Record<string, RequestListener> = {
  GET: handleUsersGet,
  POST: handleUsersPost,
};
