'use strict';
const faker = require('faker');
const bcrypt = require('bcrypt');

const user = [];
const generateRandomUserData = async () => {
  const hash = await bcrypt.hash('password123', 12);
  while (user.length <= 100) {
    user.push({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    })
  }
}

const users = [...Array(100)].map((user) => (
  {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(12, true),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date()
  }
))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await generateRandomUserData();
    return queryInterface.bulkInsert('User', user, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
