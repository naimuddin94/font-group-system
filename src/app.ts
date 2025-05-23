/*
 * Title: Font group system
 * Description: Font group system backend system using express
 * Author: Md Naim Uddin
 * Date: 27/03/2025
 *
 */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import routes from './app/routes';
import { globalErrorHandler, notFound } from './app/utils';

const app: Application = express();

app.use(
  cors({
    origin: [
      'https://font-group-system-client.vercel.app',
      'http://localhost:5173',
    ],
  })
);
app.use(cookieParser());

// static files
app.use('/public', express.static('public'));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Express server is running :(' });
});

//global error handler
app.use(globalErrorHandler as unknown as express.ErrorRequestHandler);

//handle not found
app.use(notFound);

export default app;
