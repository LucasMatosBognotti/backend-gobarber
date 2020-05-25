import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 13, 11).getTime());

    const appointment = await createAppointmentService.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 12),
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 13, 11).getTime());

    const appoinmentSameDate = new Date(2020, 4, 13, 12);

    await createAppointmentService.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: appoinmentSameDate,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: appoinmentSameDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoinment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 13, 11).getTime());

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 4, 13, 10),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointmet with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 13, 11).getTime());

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'provider',
        date: new Date(2020, 4, 13, 12),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5p,', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 13, 11).getTime());

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 4, 14, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 4, 14, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
