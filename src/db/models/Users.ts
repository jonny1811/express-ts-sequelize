import { DataTypes, Model } from 'sequelize';
import sequelizeConnection from '../../config/database.config';

interface UsersModel {
	id: string;
	name?: string;
	type: number;
	password: string;
	email: string;
}

export class Users extends Model<UsersModel> {}

Users.init(
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type: {
			type: DataTypes.NUMBER,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: false,
		}
	},
	{
		sequelize: sequelizeConnection,
		tableName: 'User',
        paranoid: true
	}
);

export default Users;
