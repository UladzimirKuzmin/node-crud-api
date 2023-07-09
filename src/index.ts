import { createServer } from 'node:http';
import dotenv from 'dotenv';

import { router } from './router';

dotenv.config();

const server = createServer(router);

const startServer = async () => {
  try {
    await server.listen(process.env.PORT);
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

startServer();
