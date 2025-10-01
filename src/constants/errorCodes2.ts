export const ERRORS = {
    SERVICE_ACTION: {
    NOT_FOUND: {
      code: 'SERVICE_ACTION_NOT_FOUND',
      message: 'Service action not found',
    },
    CODE_EXISTS: {
      code: 'SERVICE_ACTION_CODE_EXISTS',
      message: 'Service action with this code already exists',
    },
  },
  COMMISSION_TEMPLATE: {
    NOT_FOUND: {
      code: 'COMMISSION_TEMPLATE_NOT_FOUND',
      message: 'Commission template not found',
    },
  },
    SERVICE_TEMPLATE: {
    NOT_FOUND: {
      code: 'SERVICE_TEMPLATE_NOT_FOUND',
      message: 'Service template not found',
    },
    ALREADY_EXISTS: {
      code: 'SERVICE_TEMPLATE_ALREADY_EXISTS',
      message: 'This service action is already linked to this template',
    },
    NOT_FOUND_FOR_ACTION: {
      code: 'SERVICE_TEMPLATE_NOT_FOUND_FOR_ACTION',
      message: 'No default template found for this service action',
    },
  },
}