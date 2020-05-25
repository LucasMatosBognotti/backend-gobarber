import { injectable, inject } from 'tsyringe';
import  { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(`providers-list:${id}`);

    if (!users) {
      users = await this.usersRepository.findAllProvider({
        except_user_id: id,
      });

      await this.cacheProvider.save(`providers-list:${id}`, classToClass(users));
    }

    return users;
  }
}

export default ListProvidersService;
