import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database'; // initialize database
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from './core/ApiError';
import routes from './routes';

process.on('uncaughtException', (e) => {
  console.error(e);
});

const app = express();
const apiRouter = express.Router();
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 })
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
// app.use('/', routes);
app.use('/api', apiRouter);
apiRouter.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      console.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
  } else {
    console.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    console.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
