import http, { ServerResponse, IncomingMessage } from 'http';
import { User } from '../types';
import { handleUsersGet, handleUserGet, handleUserDelete } from './index';

jest.mock('http');

jest.mock('../utils', () => ({
  getFilename: jest.fn(),
  readUsersFile: jest.fn().mockResolvedValue(getMock().users),
  writeUsersFile: jest.fn().mockResolvedValue(undefined),
  extractUserIdAndBasePath: jest.fn().mockReturnValue({ userId: getMock().userId }),
}));

function getMock() {
  const users: { data: User[] } = {
    data: [
      {
        id: '95b50714-292f-4999-bbce-7328eef49acb',
        username: 'user1',
        age: 25,
        hobbies: ['reading', 'gaming'],
      },
      {
        id: '13be3208-54af-4a39-831c-d26c67f32a5a',
        username: 'user2',
        age: 30,
        hobbies: ['coding', 'sports'],
      },
    ],
  };
  return { users, userId: '95b50714-292f-4999-bbce-7328eef49acb' };
}

describe('Handlers', () => {
  describe('handleUsersGet', () => {
    test('should return the list of users', async () => {
      const { users } = getMock();
      const res = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as unknown as ServerResponse;

      jest.spyOn(http, 'ServerResponse').mockReturnValue(res);

      await handleUsersGet({} as IncomingMessage, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(users));
    });
  });

  describe('handleUserGet', () => {
    test('should return user by id', async () => {
      const { users, userId } = getMock();

      const req = { url: `/api/users/${userId}` } as IncomingMessage;
      const res = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as unknown as ServerResponse;

      jest.spyOn(http, 'ServerResponse').mockReturnValue(res);
      jest.spyOn(http, 'IncomingMessage').mockReturnValue(req);

      await handleUserGet(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse((res.end as jest.Mock).mock.calls[0][0])).toEqual(users.data[0]);
    });
  });

  describe('handleUserDelete', () => {
    test('should delete user by id', async () => {
      const { userId } = getMock();

      const req = { url: `/api/users/${userId}` } as IncomingMessage;
      const res = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as unknown as ServerResponse;

      jest.spyOn(http, 'ServerResponse').mockReturnValue(res);
      jest.spyOn(http, 'IncomingMessage').mockReturnValue(req);

      await handleUserDelete(req, res);

      expect(res.statusCode).toBe(204);
      expect((res.end as jest.Mock).mock.calls[0][0]).toEqual('User successfully deleted!');
    });
  });
});
