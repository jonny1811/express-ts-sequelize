import { Router } from 'express';
import Middleware from '../../db/middleware';
import ProductsController from '../controller/products';

const productsBaseUrl = '/products';

export default (router: Router): void => {
    router.post(
        `${productsBaseUrl}/create`,
        Middleware.handleValidationError,
    )
}
