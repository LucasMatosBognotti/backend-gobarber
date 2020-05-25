import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashPRovider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

let updateUser: UpdateUserService;

describe('Update User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashPRovider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashPRovider,
      fakeCacheProvider,
    );

    updateUser = new UpdateUserService(
      fakeUsersRepository,
      fakeHashPRovider,
    );
  });

  it('should be able to updade', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const update = await updateUser.execute({
      id: user.id,
      name: 'Marie',
      email: 'marie@test.com',
    });

    expect(update.name).toBe('Marie');
  });

  it('should be able to update one user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const update = await updateUser.execute({
      id: user.id,
      name: 'Marie',
      email: 'marie@test.com',
      old_password: '123456',
      password: '123123',
    });

    expect(update.name).toBe('Marie');
  });

  it('should not be able to update user that does not exist', async () => {
    await expect(
      updateUser.execute({
        id: '123',
        name: 'John Doe',
        email: 'johndoe@test.com',
        old_password: '123456',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user with the same email', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await createUser.execute({
      name: 'Marie Doe',
      email: 'marie@test.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        id: user.id,
        name: 'Marie',
        email: 'marie@test.com',
        password: '123123',
        old_password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);

    const user1 = await updateUser.execute({
      id: user.id,
      name: 'Marie',
      email: 'johndoe@test.com',
      old_password: '123456',
      password: '123123',
    });

    expect(user1).toHaveProperty('id');
  });

  it('should not be able to upadate password without old password', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        id: user.id,
        name: 'Marie',
        email: 'marie@test.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upadate the password with wrong old password', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        id: user.id,
        name: 'Marie',
        email: 'marie@test.com',
        old_password: '123123',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
