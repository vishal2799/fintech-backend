import { asyncHandler } from "../../utils/asyncHandler";
import { successHandler } from "../../utils/responseHandler";
import { getServicesForWLAdmin, setTenantServiceOverrides } from "./wlService.service";

export const getTenantServices = asyncHandler(async (req, res) => {
  const tenantId = req.user?.tenantId!;
  const data = await getServicesForWLAdmin(tenantId);
  return successHandler(res, { data });
});

export const updateTenantServices = asyncHandler(async (req, res) => {
  // const { overrides } = (req as any).validated;
    const overrides = req.body
    console.log(overrides)
  const tenantId = req.user?.tenantId!;

  await setTenantServiceOverrides(tenantId, overrides.services);
  return successHandler(res, {data: null, message: 'Tenant services updated' });
});


