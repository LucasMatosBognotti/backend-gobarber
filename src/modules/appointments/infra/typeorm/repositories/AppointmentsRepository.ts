import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMouthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMouthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({ where: { date, provider_id } });

    return appointment;
  }

  public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMouthFromProviderDTO): Promise<Appointment[]> {
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw((dateFielName) => `to_char(${dateFielName}, 'MM-YYYY') = '${parseMonth}-${year}'`),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id, day, month, year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parseMonth = String(month).padStart(2, '0');
    const parseDay = String(day).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw((dateFielName) => `to_char(${dateFielName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`),
      },
      relations: ['user'],
    });

    return appointments;
  }
}

export default AppointmentsRepository;
