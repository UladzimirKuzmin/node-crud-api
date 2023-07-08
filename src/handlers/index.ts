import { RequestListener } from 'node:http';
import { validate } from 'uuid';

import {
  extractUserIdAndBasePath,
  parsePostData,
  sendResponseMessage,
  sendResponseUserData,
} from '../utils';
import { findUsers, findUserById, createUser, updateUser, deleteUser } from '../models';
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

export const handleUsersGet: RequestListener = async (_, res): Promise<void> => {
  try {
    const users = await findUsers();
    if (users) {
      sendResponseUserData(res, 200, users);
    } else {
      sendResponseMessage(res, 404, 'Resource is not found!');
    }
  } catch (error) {
    throw `Users GET operation failed: ${error}`;
  }
};

export const handleUsersPost: RequestListener = async (req, res): Promise<void> => {
  try {
    const body = await parsePostData(req);
    const data = JSON.parse(body);

    if (!data.username || !data.age || !data.hobbies) {
      sendResponseMessage(res, 400, 'Missing required fields!');
      return;
    }

    const newUser = (await createUser(body)) as User;
    sendResponseUserData(res, 201, newUser);
  } catch (error) {
    throw `Users POST operation failed: ${error}`;
  }
};

export const handleUserGet: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId = '' } = extractUserIdAndBasePath(req.url || '');

    if (!validate(userId)) {
      sendResponseMessage(res, 400, 'userId is not valid, should have uuidV4 format');
      return;
    }

    const user = await findUserById(userId);

    if (user) {
      sendResponseUserData(res, 200, user);
    } else {
      sendResponseMessage(res, 404, 'Resource is not found!');
    }
  } catch (error) {
    throw `User GET operation failed: ${error}`;
  }
};

export const handleUserPut: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId = '' } = extractUserIdAndBasePath(req.url || '');

    if (!validate(userId)) {
      sendResponseMessage(res, 400, 'userId is not valid, should have uuidV4 format');
      return;
    }

    const body = await parsePostData(req);
    const user = await updateUser(userId, body);

    if (user) {
      sendResponseUserData(res, 200, user);
    } else {
      sendResponseMessage(res, 404, 'Resource is not found!');
    }
  } catch (error) {
    throw `Users PUT operation failed: ${error}`;
  }
};

export const handleUserDelete: RequestListener = async (req, res): Promise<void> => {
  try {
    const { userId = '' } = extractUserIdAndBasePath(req.url || '');

    if (!validate(userId)) {
      sendResponseMessage(res, 400, 'userId is not valid, should have uuidV4 format');
      return;
    }

    const userToDelete = await deleteUser(userId);

    if (userToDelete) {
      sendResponseMessage(res, 204, 'User successfully deleted!');
    } else {
      sendResponseMessage(res, 404, 'Resource is not found!');
    }
  } catch (error) {
    throw `Users DELETE operation failed: ${error}`;
  }
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
