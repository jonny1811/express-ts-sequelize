import * as bcrypt from 'bcrypt';

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Users } from "../../db/models";


class UsersController {

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
}

export default new UsersController();
