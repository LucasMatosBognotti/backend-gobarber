import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetOneUserService from '@modules/users/services/GetOneUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

class UsersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const getOneUser = container.resolve(GetOneUserService);

    const user = await getOneUser.execute({ id });

    return res.json({ user: classToClass(user) });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json({ user: classToClass(user) });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const {
      name, email, password, old_password,
    } = req.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      email,
      password,
      old_password,
    });

    return res.json({ user: classToClass(user) });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const deleteUser = container.resolve(DeleteUserService);

    const message = await deleteUser.execute({ id });

    return res.json(message);
  }
}

export default UsersController;
