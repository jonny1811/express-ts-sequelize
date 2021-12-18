import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Users } from "../../db/models";
import { UserAddModel, UserViewModel } from '../interfaces/users';


class UsersController {
	private readonly _saltRounds = 12;
	private readonly _jwtSecret = '0.ffg5r45re2';

	static get userAttributes() {
		return ['id', 'email'];
	}
	private static _user: any;
	static get user() {
		return UsersController._user;
	}

	async register({ name, email, password, type }: UserAddModel) {
		const id = uuidv4();
		const hash = await bcrypt.hash(password, this._saltRounds);
		return await Users.create({ name, email, password: hash, id, type });
	}

	async login(userAddModel: UserAddModel) {
		const u = await Users.findOne({ where: { email: userAddModel.email } }) as Users;
		const { id, email, name, type } = u.toJSON() as UserViewModel;
		return { 
			token: jwt.sign({ id, email }, this._jwtSecret, { expiresIn: '24h' }),
			id,
			email,
			name,
			type
		};
	}

	verifyToken(token: string) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, this._jwtSecret, (err, decode) => {
				if (err) {
					resolve(false);
					return;
				}

				UsersController._user = Users.findOne({ where: { id: decode?.id } });
				resolve(true);
				return;
			});
		}) as Promise<Boolean>;
	}

	async create(req: Request, res: Response) {
		const id = uuidv4();
		const { name, email, password, type } = req.body;
		const hash = await bcrypt.hash(password, 12);
		
		try {
			const data = await Users.create({ name, email, password: hash, id, type });
			return res.json({ data, ok: true });
		} catch (e) {
			return res.json({ msg: "fail to create", status: 500, route: "/create" });
		}
	}

	async readPagination(req: Request, res: Response) {
		try {
			const limit = (req.query.limit as number | undefined) || 10;
			const offset = req.query.offset as number | undefined;

			const records = await Users.findAll({ where: {}, limit, offset });
			return res.json(records);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read" });
		}
	}

	async readByID(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await Users.findOne({ where: { id } });
			return res.json(record);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/:id" });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await Users.findOne({ where: { id } });

			if (!record) {
				return res.json({ msg: "Can not find existing record" });
			}

			const updatedRecord = await record.update({ ...req.body });
			return res.json({ record: updatedRecord });
		} catch (e) {
			return res.json({
				msg: "fail to read",
				status: 500,
				route: "/update/:id",
			});
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await Users.findOne({ where: { id } });

			if (!record) {
				return res.json({ msg: "Can not find existing record" });
			}

			const deletedRecord = await record.destroy();
			return res.json({ record: deletedRecord });
		} catch (e) {
			return res.json({
				msg: "fail to read",
				status: 500,
				route: "/delete/:id",
			});
		}
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

export default new UsersController();
