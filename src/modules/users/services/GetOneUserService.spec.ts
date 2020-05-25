import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import GetOneUserService from '@modules/users/services/GetOneUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashPRovider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;
let getOne: GetOneUserService;

describe('GetOneUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashPRovider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashPRovider,
      fakeCacheProvider,
    );

    getOne = new GetOneUserService(
      fakeUsersRepository,
    );
  });

  it('should be able to get one user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const getUser = await getOne.execute({
      id: user.id,
    });

    expect(getUser).toHaveProperty('id');
  });

  it('should not be able to get one user that does not exist', async () => {
    await expect(
      getOne.execute({
        id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
