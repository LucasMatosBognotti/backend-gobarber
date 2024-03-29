import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';


import Authentication from '@modules/users/infra/http/middlewares/Authentication';

const providersRouter = Router();
const providersController = new ProvidersController();

const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.get('/', Authentication, providersController.index);

providersRouter.get('/:provider_id/month-available', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required(),
  },
}), providerMonthAvailabilityController.index);


providersRouter.get('/:provider_id/day-available', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required(),
  },
}), providerDayAvailabilityController.index);

export default providersRouter;
