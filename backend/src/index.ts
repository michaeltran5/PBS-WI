import express, { Request, Response, NextFunction, Application } from "express";
import cors from 'cors';
import customApi from './routes/customApi';
import pbsProxy from './routes/pbsProxy';

// create express app
const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());

// api routes
app.use('/api', pbsProxy);
app.use('/api', customApi);

// error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: { message: err.message, }, });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error('Error starting the server:', err.message);
    process.exit(1);
  }
  console.log(`Server is listening on port ${PORT}`);
});