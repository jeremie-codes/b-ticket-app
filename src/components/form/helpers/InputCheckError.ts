import { SetStateAction } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

export type ServerErrorType = {
  [field: string]: {
    message: string;
  };
};

export type InputCheckErrorType = {
  name: string;
  serverErrors?: SetStateAction<ServerErrorType>;
  errors?: FieldErrors<FieldValues>;
};

export const inputCheckError = (
  name: string,
  serverErrors?: SetStateAction<ServerErrorType>,
  errors?: FieldErrors<FieldValues>
) => {
  return (
    !!(errors && errors[name]) ||
    !!(
      serverErrors &&
      serverErrors[name as keyof SetStateAction<ServerErrorType>]
    )
  );
};
