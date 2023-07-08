import { IncomingMessage, ServerResponse } from 'http';

import { routes } from './routes';
import { extractUserIdAndBasePath, sendResponseMessage } from '../utils';

export const router = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const { basePath } = extractUserIdAndBasePath(req.url || '');
  const routeHandler = routes[basePath || 'default'] || routes.default;

  try {
    await routeHandler(req, res);
  } catch (error) {
    console.error('Error:', error);
    sendResponseMessage(res, 500, 'Internal server error');
  }
};
