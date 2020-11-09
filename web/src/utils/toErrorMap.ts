import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) =>
  errors.reduce((acc, { field, message }): Record<string, string> => {
    acc[field] = message;
    return acc;
  }, {});
