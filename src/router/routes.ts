import { RequestListener } from 'node:http';

import { handleUsers } from '../handlers';
import { sendResponseMessage } from '../utils';

const API_PREFIX = '/api';

export const routes: Record<string, RequestListener> = {
  [`${API_PREFIX}/users`]: handleUsers,
  default: (_, res) => sendResponseMessage(res, 404, 'Resource is not found!'),
};
