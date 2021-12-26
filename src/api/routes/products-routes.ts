import { Router } from 'express';
import Middleware from '../../db/middleware';
import ProductsValidator from '../../db/validators/products.validator';
import ProductsController from '../controller/products';

const productsBaseUrl = '/products';

export default (router: Router): void => {
    router.post(
        `${productsBaseUrl}/create`,
        ProductsValidator.checkCreateProducts(),
        Middleware.handleValidationError,
        ProductsController.create
    );

    router.get(
        `${productsBaseUrl}`,
        ProductsValidator.checkGetProducts(),
        Middleware.handleValidationError,
        ProductsController.getRecordsWithPagination
    );

    router.get(
        `${productsBaseUrl}/:id`,
        ProductsValidator.checkIdParam(),
        Middleware.handleValidationError,
        ProductsController.getByID
    );

    router.put(
        `${productsBaseUrl}/update/:id`,
        ProductsValidator.checkIdParam(),
        Middleware.handleValidationError,
        ProductsController.update
    );

    router.delete(
        `${productsBaseUrl}/delete/:id`,
        ProductsValidator.checkIdParam(),
        Middleware.handleValidationError,
        ProductsController.delete
    )
}
