import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsResitory: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id, day, month, year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    // let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);

    let appointments;

    if (!appointments) {
      appointments = await this.appointmentsResitory.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
