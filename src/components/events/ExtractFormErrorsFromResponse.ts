import { ServerErrorType } from "src/components/form/helpers/InputCheckError";
type ResponseFormErrorType = {
  field: string;
  message: string;
};
export const extractFormErrorsFromResponse = (errors: []) => {
  let serverErrorsObject = {};
  errors.map((error: ResponseFormErrorType) => {
    const field = error.field;
    const message = error.message;
    const errrMessage: ServerErrorType = {
      [field]: { message: message },
    };
    return Object.assign(serverErrorsObject, errrMessage);
  });

  return serverErrorsObject;
};

export const createServerErrorArray = (errorObject: {
  [key: string]: string[];
}): ServerErrorType => {
  const serverErrors: ServerErrorType = Object.keys(errorObject).reduce(
    (errors, field) => {
      const message = errorObject[field][0];
      return {
        ...errors,
        [field]: { message },
      };
    },
    {}
  );

  return serverErrors;
};
