import { IncomingMessage, ServerResponse } from 'http';

import { routes } from './routes';
import { extractUserIdAndBasePath } from '../helpers';

export const router = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const { basePath } = extractUserIdAndBasePath(req.url || '');
  const routeHandler = routes[basePath || 'default'] || routes.default;

  try {
    await routeHandler(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
};
