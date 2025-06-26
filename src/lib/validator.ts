import { customizeValidator } from '@rjsf/validator-ajv8';

export const validatorWithDataSupport = customizeValidator({
  ajvOptionsOverrides: {
    verbose: true,
    allErrors: true,
    $data: true,
  },
}); 