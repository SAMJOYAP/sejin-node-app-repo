import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
});

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello Express + TypeScript!!!');
});

app.get('/api/count', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT count FROM counter WHERE id = 1');

    res.json({
      success: true,
      count: result.rows[0]?.count ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post('/api/count', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      UPDATE counter
      SET count = count + 1
      WHERE id = 1
      RETURNING count
      `,
    );

    res.json({
      success: true,
      count: result.rows[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
