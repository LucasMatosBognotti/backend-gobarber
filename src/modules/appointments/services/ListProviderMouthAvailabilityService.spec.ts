import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import ListProviderMouthAvailabilityService from '@modules/appointments/services/ListProviderMouthAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;

let listProviderMouth: ListProviderMouthAvailabilityService;

describe('ListProviderMouthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listProviderMouth = new ListProviderMouthAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it('should be able to list the mouth availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 9, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 13, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 16, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 13, 17, 0, 0),
    });

    const availability = await listProviderMouth.execute({
      provider_id: 'provider',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { day: 12, available: true }, // Disponivel
      { day: 13, available: false }, // Marcado o agendamento
      { day: 14, available: true }, // Disponivel
      { day: 15, available: true }, // Disponivel
    ]));
  });
});
