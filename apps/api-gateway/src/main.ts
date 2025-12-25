// import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import proxy from 'express-http-proxy';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
// import swagger from 'swagger-ui-express';

const host = process.env.HOST ?? 'http://localhost';
const port = process.env.API_GATEWAY_PORT
  ? Number(process.env.API_GATEWAY_PORT)
  : 8080;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: 'Too many requests, please try again later!' },
  legacyHeaders: true,
  keyGenerator: (req, _res) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    return ipKeyGenerator(ip);
  },
});

app.use(limiter);

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/api', proxy(`${host}:${process.env.AUTH_SERVICE_PORT}`));

app.listen(port, () => {
  console.log(`[ ready ] ${host}:${port}`);
});
