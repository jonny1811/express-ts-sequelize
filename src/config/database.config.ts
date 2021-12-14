import { Sequelize } from 'sequelize';

const sequelizeConnection = new Sequelize('app', '', '', {
	storage: './database.sqlite',
	dialect: 'sqlite',
	logging: false
});

export default sequelizeConnection;
