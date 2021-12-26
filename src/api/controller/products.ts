import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Products } from '../../db/models';

class ProductsController {
    
    async create(req: Request, res: Response) {
        const id = uuidv4();
        const { name, description, quantity, price } = req.body;

        try {
            const data = await Products.create({ name, description, quantity, price, id });
            return res.json({ data, ok: true })
        } catch (error) {
            return res.json({ msg: 'fail to create', status: 500, route: '/create' });
        }
    }

    async getRecordsWithPagination(req: Request, res: Response) {
        try {
            const limit = (req.query.limit as number | undefined) || 10;
            const offset = req.query.offset as number | undefined;

            const records = await Products.findAll({ where: {}, limit, offset });
            return res.json(records);
        } catch (error) {
            return res.json({ msg: 'fail to read', status: 500, route: 'getAll' });
        }
    }

    async getByID(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const record = await Products.findOne({ where: { id } });
            return res.json(record);
        } catch (error) {
            return res.json({ msg: 'fail to find one product', status: 500, route: '/get/:id' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const record = await Products.findOne({ where: { id } });

            if (!record) {
                return res.json({ msg: 'Cant find existing record' });
            }

            const updateRecord = await record.update({ ...req.body });
            return res.json({ record: updateRecord });
        } catch (error) {
            return res.json({
                msg: 'fail to update',
                status: 500,
                route: '/update/:id'
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const record = await Products.findOne({ where: { id } });

            if (!record) {
                return res.json({ msg: 'Cant find existing record' });
            }

            const deletedRecord = await record.destroy();
            return res.json({ record: deletedRecord });
        } catch (error) {
            return res.json({
				msg: 'fail to delete',
				status: 500,
				route: '/delete/:id',
			});
        }
    }
}

export default new ProductsController();
