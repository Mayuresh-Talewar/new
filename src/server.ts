import express from 'express';
import { PrismaClient } from '@prisma/client';

express()
  .use(require('cors')(), express.json())
  .get('/dishes', async (_req, res) => res.json(await new PrismaClient().dish.findMany()))
  .listen(3001, () => console.log('Server running on http://localhost:3001'));