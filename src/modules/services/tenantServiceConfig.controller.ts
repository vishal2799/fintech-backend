import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { TenantServiceConfigService } from './tenantServiceConfig.service';

export const TenantServiceConfigController = {
  getTenantServices: asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId;
    const data = await TenantServiceConfigService.getServicesForTenant(tenantId);
    return successHandler(res, {
      message: 'Tenant services fetched',
      data,
      status: 200,
    });
  }),

  updateTenantServices: asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId;
    const config = req.body as { serviceId: string; isTenantGloballyEnabled: boolean }[];
    await TenantServiceConfigService.updateTenantServiceConfig(tenantId, config);
    return successHandler(res, { data: null,
      message: 'Tenant services updated',
      status: 200,
    });
  }),
};
