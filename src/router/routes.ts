import { RequestListener } from 'node:http';

import { handleUsers, handleNotFound } from '../handlers';

const API_PREFIX = '/api';

export const routes: Record<string, RequestListener> = {
  [`${API_PREFIX}/users`]: handleUsers,
  default: handleNotFound,
};
