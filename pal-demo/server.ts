/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import payload from '../src';

const expressApp = express();

expand(dotenv.config());

expressApp.use('/assets', express.static(path.resolve(__dirname, 'assets')));

payload.init({
  secret: 'SECRET_KEY',
  mongoURL: process.env.DB_URL,
  express: expressApp,
  email: {
    fromName: 'Payload',
    fromAddress: 'hello@payloadcms.com',
  },
  onInit: (app) => {
    app.logger.info('Payload Demo Initialized');
  },
});

const externalRouter = express.Router();

externalRouter.use(payload.authenticate);

externalRouter.get('/', (req, res) => {
  if (req.user) {
    return res.send(`Authenticated successfully as ${req.user.email}.`);
  }

  return res.send('Not authenticated');
});

expressApp.use('/external-route', externalRouter);

expressApp.listen(3000, async () => {
  payload.logger.info(`Admin URL on ${payload.getAdminURL()}`);
  payload.logger.info(`API URL on ${payload.getAPIURL()}`);
});
