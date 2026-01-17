// import { resolve } from 'path';
// import { register } from 'tsconfig-paths';

// // Use process.cwd() which points to workspace root when run via nx
// register({
//   baseUrl: process.cwd(),
//   paths: {
//     '@packages/*': ['packages/*'],
//   },
// });

import { errorMiddleware } from '@packages/error-handler/error-middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { default as swaggerUi } from 'swagger-ui-express';

import authRouter from './routes/auth.router.js';
const swaggerDocument = require('./swagger-output.json');

const host = process.env.HOST ?? 'http://localhost';
const port = process.env.AUTH_SERVICE_PORT
  ? Number(process.env.AUTH_SERVICE_PORT)
  : 6001;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/health', (req, res) => {
  res.status(200).send('Auth Service running successfully!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/api', authRouter);

app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Auth service is running at ${host}:${port}/api`);
  console.log(`Swagger Docs available at ${host}:${port}/docs-json`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

server.on('error', (err) => {
  console.log('Server Error: ', err);
});
