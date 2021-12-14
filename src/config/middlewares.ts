import cors from 'cors';
import bodyParser from 'body-parser';

import { Express } from 'express';
import { tokenGuard } from '../db/middleware/token-guard';

export default (app: Express): void => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    // app.use(tokenGuard());
};
