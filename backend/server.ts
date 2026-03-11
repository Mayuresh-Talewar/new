import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/dishes', async (req, res) => {
  const dishes = await prisma.dish.findMany();
  res.json(dishes);
});

// Add more routes for reservations, orders, etc.

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});