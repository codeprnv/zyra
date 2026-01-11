import { errorMiddleware } from '@packages/error-handler/error-middleware';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import orderRouter from './routes/order.route';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to order-service!' });
});

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser())

app.use(errorMiddleware)

app.use('/api', orderRouter)

const port = process.env.ORDER_SERVICE_PORT
  ? Number(process.env.ORDER_SERVICE_PORT)
  : 6004;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
