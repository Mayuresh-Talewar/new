import express, { json } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(json());

app.get('/dishes', async (_req, res) => {
  const dishes = await prisma.dish.findMany();
  res.json(dishes);
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));