import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import express from 'express';
import adminRouter from './routes/admin.route';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', adminRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to admin-service!' });
});

app.use(errorMiddleware);

const port = process.env.ADMIN_SERVICE_PORT
  ? Number(process.env.ADMIN_SERVICE_PORT)
  : 6005;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
