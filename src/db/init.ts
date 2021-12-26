
import { Products, Users } from './models';

const dbInit = () => Promise.all([
   Users.sync({ alter: true }),
   Products.sync({ alter: true })
]);

export default dbInit;