import { Router } from 'express';
import multer from 'multer';

import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';

import UsersController from '@modules/users/infra/http/controllers/UsersController';

import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

import Authentication from '@modules/users/infra/http/middlewares/Authentication';

const userRouter = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

userRouter.get('/', Authentication, usersController.show);

userRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), usersController.create);

userRouter.put('/', Authentication, celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password')),
  },
}), usersController.update);

userRouter.delete('/', Authentication, usersController.delete);

userRouter.patch('/', Authentication, upload.single('avatar'), userAvatarController.update);

export default userRouter;
