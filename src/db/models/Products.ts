import { DataTypes, Model } from 'sequelize';
import sequelizeConnection from '../../config/database.config';

interface ProductsModel {
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
}

export class Products extends Model<ProductsModel> {}

Products.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 0
        },
        price: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'Products',
        paranoid: true
    }
);

export default Products;
