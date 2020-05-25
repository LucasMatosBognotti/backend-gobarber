import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      id,
    });

    return res.json(classToClass(providers));
  }
}

export default ProvidersController;
