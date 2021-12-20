import { IncomingHttpHeaders } from 'http';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import SessionController from '../../api/controller/session';

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
  const header = headers.authorization as string;

  if (!header) {
    return header;
  }

  return header.split(' ')[1];
}

export const tokenGuard: (() => RequestHandler) = (() => (req, res, next) => {

  const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || '';
  const hasAccess = SessionController.verifyToken(token);

  hasAccess.then(a => {
    if (!a) {
        return res.status(403).send({ message: 'No access' });
    }
    next();
  });
});

class TokenGuardMiddleware {
  tokenGuard(req: Request, res: Response, next: NextFunction) {
    const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || '';
    const hasAccess = SessionController.verifyToken(token);

    hasAccess.then(a => {
      if (!a) {
          return res.status(403).send({ message: 'No access' });
      }
      next();
    });
  }
}
export default new TokenGuardMiddleware();
