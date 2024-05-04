import { StyleSheet, View } from "react-native";
import React, { SetStateAction } from "react";
import { InputCheckErrorType, ServerErrorType } from "./InputCheckError";
import { InputHelperMessage } from "./InputHelperMessage";

export const RenderErrorMessage: React.FC<InputCheckErrorType> = ({
  errors,
  serverErrors,
  name,
}: InputCheckErrorType) => {
  return (
    <View>
      {!serverErrors && errors && errors[name] && (
        <InputHelperMessage
          type="error"
          message={errors[name]?.message?.toString()}
        />
      )}
      {serverErrors &&
        serverErrors[name as keyof SetStateAction<ServerErrorType>] && (
          <InputHelperMessage
            type="error"
            message={
              serverErrors[name as keyof SetStateAction<ServerErrorType>][
                "message"
              ]
            }
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({});
