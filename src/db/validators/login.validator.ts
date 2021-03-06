import * as bcrypt from 'bcrypt'
import { check } from 'express-validator'
import { is } from 'sequelize/types/lib/operators';
import { Users } from '../models/index';

export const loginValidator = {
  forRegister: [
    check('name')
      .optional()
      .notEmpty()
      .isString(),
    check('type')
      .isNumeric()
      .notEmpty(),
    check('email')
      .isEmail().withMessage('Invalid email format')
      .custom(email => Users.findAll({ where: { email } }).then(u => !!!u)).withMessage('Email exists'),
    check('password')
      .isLength({ min: 8 }).withMessage('Invalid password'),
    check('confirmPassword')
      .custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
  ],
  forLogin: [
    check('email')
      .isEmail().withMessage('Invalid email format')
      .custom(email => Users.findOne({ where: { email } }).then(u => !!u)).withMessage('Invalid email or password'),
    check('password')
      .custom((password, { req }) => {
        return Users.findOne({ where: { email: req.body.email } })
          .then(u => bcrypt.compare(password, u?.getDataValue('password') as any))
      }).withMessage('Invalid email or password')
  ]
}
