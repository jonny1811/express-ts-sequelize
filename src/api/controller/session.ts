import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Users } from "../../db/models";
import { UserAddModel, UserViewModel } from '../interfaces/users';

class SessionController {
    private readonly _saltRounds = 12;
	private readonly _jwtSecret = '0.ffg5r45re2';

	static get userAttributes() {
		return ['id', 'email'];
	}
	private static _user: any;
	static get user() {
		return SessionController._user;
	}

	async register({ name, email, password, type }: UserAddModel) {
		const id = uuidv4();
		const hash = await bcrypt.hash(password, this._saltRounds);
		return await Users.create({ name, email, password: hash, id, type });
	}

	async login(req: Request, res: Response, userAddModel: UserAddModel) {
        try {
            const user = await Users.findOne({ where: { email: userAddModel.email } }) as Users;

            if (!user) {
                res.json({ msg: 'User not found', status: 404 });
            }

            const { id, email, name, type } = user.toJSON() as UserViewModel;
            return { 
                token: jwt.sign({ id, email }, this._jwtSecret, { expiresIn: '24h' }),
                id,
                email,
                name,
                type
            };
        } catch (error) {
            res.json({ msg: `Internal Server Error: ${error}`, status: 501 });
        }
	}

	verifyToken(token: string) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, this._jwtSecret, (err, decode) => {
				if (err) {
					resolve(false);
					return;
				}

				SessionController._user = Users.findOne({ where: { id: decode?.id } });
				resolve(true);
				return;
			});
		}) as Promise<Boolean>;
	}

    async checkToken(req: Request, res: Response) {
		const jwtSecret = '0.ffg5r45re2';
		const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
		req.body.token = token;
		if (!token) {
			res.json({ status: 401, msg: 'Not authorized: Not exist Token' });
		} else {
			jwt.verify(token, jwtSecret, (err: any, decode: any) => {
				if (err) {
					res.json({ status: 401, msg: 'Not authorized: Invalid Token' })
				} else {
					req.body.email = decode.email;
					res.json({ status: 200 });
				}
			});
		}
	}

	async destroyToken(req: Request, res: Response) {
		const token = req.headers.token;
		if (token) {
			res.cookie('token', null, { httpOnly: true });
		} else {
			res.status(401).send('Logout unauthorized');
		}
		res.send('Successfull Logout');
	}
}

export default new SessionController();
