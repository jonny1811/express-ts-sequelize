import setupMiddleware from './middlewares';
import setuptRoutes from './routes'

import express, { Express } from 'express';

export const setupApp = (): Express => {
    const app = express();
    setupMiddleware(app);
    setuptRoutes(app);

    return app;
}
