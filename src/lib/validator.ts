import { customizeValidator } from '@rjsf/validator-ajv8';

export const validatorWithDataSupport = customizeValidator({
  ajvOptionsOverrides: {
    verbose: true,
    removeAdditional: 'all',
    $data: true,
  },
}); 

export const filterDataBySchema = (data: any, schema: any) => {
  const clone = structuredClone(data);
  validatorWithDataSupport.rawValidation(schema, clone);
  return clone;
}