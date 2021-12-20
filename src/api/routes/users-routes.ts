import { Router } from 'express';
import UsersValidator from '../../db/validators';
import Middleware from '../../db/middleware';
import UsersController from '../controller/users';
import TokenGuardMiddleware from '../../db/middleware/token-guard';

const userBaseUrl = '/users';

export default (router: Router): void => {
	router.post(
		`${userBaseUrl}/create`,
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkCreateUsers(),
		Middleware.handleValidationError,
		UsersController.create
	);
	
	router.get(
		`${userBaseUrl}`,
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkReadUsers(),
		Middleware.handleValidationError,
		UsersController.readPagination
	);
	
	router.get(
		`${userBaseUrl}/:id`,
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkIdParam(),
		Middleware.handleValidationError,
		UsersController.readByID
	);
	
	router.put(
		`${userBaseUrl}/update/:id`,
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkIdParam(),
		Middleware.handleValidationError,
		UsersController.update
	);
	
	router.delete(
		`${userBaseUrl}/delete/:id`,
		// TokenGuardMiddleware.tokenGuard,
		UsersValidator.checkIdParam(),
		Middleware.handleValidationError,
		UsersController.delete
	);
}
