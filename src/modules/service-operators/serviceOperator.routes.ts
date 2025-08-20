import { Router } from "express";
import {
  createServiceOperatorSchema,
  updateServiceOperatorSchema,
  serviceOperatorIdSchema,
} from "./serviceOperator.schema";
import {ServiceOperatorController} from "./serviceOperator.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { validate } from "uuid";

const router = Router();

router.use(requireAuth);

// Create Operator
router.post(
  "/",
//   validate(createServiceOperatorSchema),
  ServiceOperatorController.create
);

// Get All Operators (optionally by serviceId)
router.get("/", ServiceOperatorController.getAll);

// Get Operator by ID
router.get(
  "/:id",
//   validate(serviceOperatorIdSchema, "params"),
  ServiceOperatorController.getById
);

// Update Operator
router.put(
  "/:id",
//   validate(updateServiceOperatorSchema),
  ServiceOperatorController.update
);

// Delete Operator
router.delete(
  "/:id",
//   validate(serviceOperatorIdSchema, "params"),
  ServiceOperatorController.delete
);

export default router;
