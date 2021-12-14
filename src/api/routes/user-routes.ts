import { Router, Request, Response } from 'express';
import { loginValidator } from '../../db/validators/login.validator';
import { validationResult, matchedData } from 'express-validator';
import UsersValidator from '../../db/validators';
import Middleware from '../../db/middleware';
import UsersController from '../controller/users';
import { UserAddModel } from '../interfaces/users';
import TokenGuardMiddleware from '../../db/middleware/token-guard';

export default (router: Router): void => {
	router.post('/register', loginValidator['forRegister'], (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json(errors.array());
		}

		const payload = matchedData(req) as UserAddModel;
		const user = UsersController.register(payload);

		return user.then(u => res.json(u));
	});

	router.post('/login', loginValidator['forLogin'], (req: Request, res: Response) => {
		const errors = validationResult(req)
		
	
		if (!errors.isEmpty())
			return res.status(422).json(errors.array())
	
		const payload = matchedData(req) as UserAddModel;
		const token = UsersController.login(payload)
	
		return token.then(t => res.json(t))
	});

	router.get('/users/checktoken', UsersController.checkToken);
	router.get('/users/logout', UsersController.destroyToken);

	router.post(
		'/users/create',
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkCreateUsers(),
		Middleware.handleValidationError,
		UsersController.create
	);
	
	router.get(
		'/users',
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkReadUsers(),
		Middleware.handleValidationError,
		UsersController.readPagination
	);
	
	router.get(
		'/users/:id',
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkIdParam(),
		Middleware.handleValidationError,
		UsersController.readByID
	);
	
	router.put(
		'/users/update/:id',
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkIdParam(),
		Middleware.handleValidationError,
		UsersController.update
	);
	
	router.delete(
		'/users/delete/:id',
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkIdParam(),
		Middleware.handleValidationError,
		UsersController.delete
	);
}
