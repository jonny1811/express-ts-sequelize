
import { Users } from './models';

const dbInit = () => Promise.all([
   Users.sync({ alter: true }) 
])

export default dbInit;