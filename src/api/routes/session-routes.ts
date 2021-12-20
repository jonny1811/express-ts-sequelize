import { Router, Request, Response } from 'express';
import { loginValidator } from '../../db/validators/login.validator';
import { validationResult, matchedData } from 'express-validator';
import SessionController from '../controller/session';
import { UserAddModel } from '../interfaces/users';

const sessionBaseUrl = '/session';

export default (router: Router): void => {
    router.post(`${sessionBaseUrl}/register`, loginValidator['forRegister'], async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ msg: 'Validation Error', error: errors.array(), status: 422 });
		}

		const payload = matchedData(req) as UserAddModel;
		const user = await SessionController.register(payload);

		return res.json({ status: 200, data: user });
	});

	router.post(`${sessionBaseUrl}/login`, loginValidator['forLogin'], async (req: Request, res: Response) => {
		const errors = validationResult(req)
		
		if (!errors.isEmpty()) {
			return res.json({ message: 'Validation Error', error: errors.array(), status: 422 });
		}
	
		const payload = matchedData(req) as UserAddModel;
		const token = await SessionController.login(req, res, payload);
	
		return res.json({ status: 200, data: token });
	});

	router.get(`${sessionBaseUrl}/checktoken`, SessionController.checkToken);
	router.get(`${sessionBaseUrl}/logout`, SessionController.destroyToken);
}
