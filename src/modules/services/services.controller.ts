// src/modules/services/services.controller.ts

import { Request, Response } from 'express';
import * as ServiceService from './services.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await ServiceService.getAllServices();
  return successHandler(res, result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServiceService.getServiceById(req.params.id);
  if (!service) throw new Error('Service not found');
  return successHandler(res, service);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await ServiceService.createService(req.body);
  return successHandler(res, created, 'Service created', 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ServiceService.updateService(req.params.id, req.body);
  if (!updated) throw new Error('Service not found');
  return successHandler(res, updated, 'Service updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ServiceService.deleteService(req.params.id);
  if (!deleted) throw new Error('Service not found');
  return successHandler(res, null, 'Service deleted');
});


// ========== Super Admin ==========
export const listServicesGlobal = asyncHandler(async (_req: Request, res: Response) => {
  const services = await ServiceService.getAllGlobalServices();
  return successHandler(res, services);
});

export const updateGlobalService = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ServiceService.updateGlobalService(req.params.id, req.body);
  return successHandler(res, updated, 'Global service updated');
});

// ========== White Label Admin ==========
export const listTenantServices = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req?.user?.tenantId!;
  const list = await ServiceService.getTenantServices(tenantId);
  return successHandler(res, list);
});

export const updateTenantService = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req?.user?.tenantId!;
  const result = await ServiceService.updateTenantService(tenantId, req.params.id, req.body);
  return successHandler(res, result, 'Tenant service updated');
});

// ========== WL Admin – User Level ==========
export const listUserServices = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const list = await ServiceService.getUserServices(userId);
  return successHandler(res, list);
});

export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
  const { userId, serviceId } = req.params;
  const result = await ServiceService.updateUserService(userId, serviceId, req.body);
  return successHandler(res, result, 'User service updated');
});

// ========== Retailer ==========
export const listMyServices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const tenantId = req.user?.tenantId;
  if (!userId || !tenantId) throw new Error('Missing userId or tenantId');
  const list = await ServiceService.getEffectiveServicesForUser(userId, tenantId);
  return successHandler(res, list);
});


// // src/modules/services/services.controller.ts
// import { Request, Response } from 'express'
// import * as ServiceService from './services.service'

// export const getAll = async (_req: Request, res: Response) => {
//   const result = await ServiceService.getAllServices()
//   res.json(result)
// }

// export const getById = async (req: Request, res: Response) => {
//   const service = await ServiceService.getServiceById(req.params.id)
//   if (!service) {
//    res.status(404).json({ error: 'Not found' })
//    return
//   }
//   res.json(service)
// }

// export const create = async (req: Request, res: Response) => {
//   const created = await ServiceService.createService(req.body)
//   res.status(201).json(created)
// }

// export const update = async (req: Request, res: Response): Promise<void> => {
//   const updated = await ServiceService.updateService(req.params.id, req.body)
//   if (!updated) {
//     res.status(404).json({ error: 'Not found' })
//     return
//   }
//   res.json(updated)
// }

// export const remove = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params
//   if (!id) {
//     res.status(404).json({ error: 'Not found' })
//     return
//   }

//   const deleted = await ServiceService.deleteService(id)
//   if (!deleted) {
//     res.status(404).json({ error: 'Not found' })
//     return
//   }

//   res.json({ success: true })
// }


// // Super Admin
// export const listServicesGlobal = async (req: Request, res: Response) => {
//   const services = await ServiceService.getAllGlobalServices();
//   res.json(services);
// };

// export const updateGlobalService = async (req: Request, res: Response) => {
//   const updated = await ServiceService.updateGlobalService(req.params.id, req.body);
//   res.json(updated);
// };

// // White-Label Admin
// export const listTenantServices = async (req: Request, res: Response) => {
//   const tenantId = req?.user?.tenantId!;
//   const list = await ServiceService.getTenantServices(tenantId);
//   res.json(list);
// };

// export const updateTenantService = async (req: Request, res: Response) => {
//   const tenantId = req?.user?.tenantId!;
//   const result = await ServiceService.updateTenantService(tenantId, req.params.id, req.body);
//   res.json(result);
// };

// // WL Admin → control services for a specific SD/D/R user
// export const listUserServices = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const list = await ServiceService.getUserServices(userId);
//   res.json(list);
// };

// export const updateUserService = async (req: Request, res: Response) => {
//   const { userId, serviceId } = req.params;
//   const result = await ServiceService.updateUserService(userId, serviceId, req.body);
//   res.json(result);
// };

// // Retailer self view
// export const listMyServices = async (req: Request, res: Response) => {
//   const userID = req?.user?.id;
//   const tenantId = req?.user?.tenantId;
//   if (!userID || !tenantId) {
//     res.status(400).json({ error: 'Missing userId or tenantId' });
//     return;
//   }
//   const list = await ServiceService.getEffectiveServicesForUser(userID, tenantId);
//   res.json(list);
// };
