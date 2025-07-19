// // routes/admin/users.routes.ts
// import { Router } from 'express';
// import { createWLAdminUser, deleteWLAdmin, getWLAdminById, getWLAdmins, updateWLAdmin, updateWLAdminStatus } from './users.controller';
// import { requireAuth } from '../../middlewares/requireAuth';
// import { roleCheck } from '../../middlewares/roleCheck';
// import { Roles } from '../../constants/roles';

// const router = Router();

// router.use(requireAuth); // Super Admin access required
// router.use(roleCheck([Roles.SUPER_ADMIN]));

// router.get('/', getWLAdmins);                // GET /wl-admins?tenantId=optional
// router.get('/:id', getWLAdminById);          // GET /wl-admins/:id
// router.post('/', createWLAdminUser);         // POST /wl-admins
// router.put('/:id', updateWLAdmin);           // PUT /wl-admins/:id
// router.patch('/:id/status', updateWLAdminStatus); // PATCH /wl-admins/:id/status
// router.delete('/:id', deleteWLAdmin);        // DELETE /wl-admins/:id

// export default router;
