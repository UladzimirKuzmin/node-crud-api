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
    throw `Users GET operation failed: ${error}`;
  }
};

export const handleUsersPost: RequestListener = async (req, res): Promise<void> => {
  try {
    let body = '';

    req.on('data', (chunk: string) => {
      body += chunk;
    });

    await new Promise((resolve) => {
      req.on('end', resolve);
    });

    const newUser: User = {
      id: uuidV4(),
      ...JSON.parse(body),
    };

    if (!newUser.username || !newUser.age || !newUser.hobbies) {
      res.statusCode = 400;
      res.end('Missing required fields!');
      return;
    }

    const users = await readUsersFile();

    await writeUsersFile({ data: [...users.data, newUser] });

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newUser));
  } catch (error) {
    throw `Users POST operation failed: ${error}`;
  }
};

export const handleUserGet: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId = '' } = extractUserIdAndBasePath(req.url || '');
    const users = await readUsersFile();
    const user = users?.data.find((user) => user.id === userId);

    if (!validate(userId)) {
      res.statusCode = 400;
      res.end('userId does not exist');
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
    throw `User GET operation failed: ${error}`;
  }
};

export const handleUserPut: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId = '' } = extractUserIdAndBasePath(req.url || '');

    if (!validate(userId)) {
      res.statusCode = 400;
      res.end('userId does not exist');
      return;
    }

    let body = '';

    req.on('data', (chunk: string) => {
      body += chunk;
    });

    await new Promise((resolve) => {
      req.on('end', resolve);
    });

    const users = await readUsersFile();
    const index = users?.data.findIndex((user) => user.id === userId);

    if (index !== -1) {
      const updatedUsers = users?.data.map((user, i) =>
        index === i ? { ...user, ...JSON.parse(body), id: userId } : user,
      );

      await writeUsersFile({ data: updatedUsers });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(updatedUsers[index]));
    } else {
      handleNotFound(req, res);
    }
  } catch (error) {
    throw `Users PUT operation failed: ${error}`;
  }
};

export const handleUserDelete: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId = '' } = extractUserIdAndBasePath(req.url || '');

    if (!validate(userId)) {
      res.statusCode = 400;
      res.end('userId does not exist');
      return;
    }

    const users = await readUsersFile();
    const index = users.data.findIndex((user) => user.id === userId);

    if (index !== -1) {
      await writeUsersFile({ data: users.data.filter((user) => user.id !== userId) });
      res.statusCode = 204;
      res.end('User successfully deleted!');
    } else {
      handleNotFound(req, res);
    }
  } catch (error) {
    throw `Users DELETE operation failed: ${error}`;
  }
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
