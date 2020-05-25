import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<string> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not exist', 404);
    }

    await this.usersRepository.delete(id);

    return ('Delete with successuly');
  }
}

export default DeleteUserService;
