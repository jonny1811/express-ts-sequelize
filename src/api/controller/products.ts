import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Products } from '../../db/models';

class ProductsController {
    async create(req: Request, res: Response) {
        const id = uuidv4();
        const { name, description, quantity, price } = req.body;

        try {
            const data = await Products.create({ name, description, quantity, price, id });
        } catch (error) {
            return res.json({ msg: 'fail to create', status: 500, route: '/create' });
        }
    }
}

export default new ProductsController();
