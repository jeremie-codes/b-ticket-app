import { FC, SetStateAction } from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { KeyboardType, StyleSheet, View } from "react-native";
import { moderateScale } from "src/constants/Metric";
import { AppInput } from "./AppInput";
import { AppTextBody } from "../ui/texts/AppTextBody";
import { defaultTheme } from "src/themes";
import { ServerErrorType, inputCheckError } from "./helpers/InputCheckError";
import { RenderErrorMessage } from "./helpers/RenderErrorMessage";

export type AppInputControllerType = {
  control?: Control;
  defaultValue?: string;
  rules: object;
  placeholder: string;
  isEditable?: boolean;
  invalid?: boolean;
  label?: string;
  style?: object;
  inputConfig?: object;
  name: string;
  helpText?: string;
  errors?: FieldErrors<FieldValues>;
  serverErrors?: SetStateAction<ServerErrorType>;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  col?: number;
};
export const AppInputController: FC<AppInputControllerType> = (
  props: AppInputControllerType
) => {
  return (
    <>
      <Controller
        control={props.control}
        defaultValue={props.defaultValue}
        rules={props.rules}
        name={props.name}
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            placeholder={props.placeholder}
            isEditable={props.isEditable}
            isInvalid={inputCheckError(
              props.name,
              props.serverErrors,
              props.errors
            )}
            label={props.label}
            inputConfig={{
              onChangeText: onChange,
              onBlur,
              value,
              multiline: props.multiline,
              secureTextEntry: props.secureTextEntry,
              keyboardType: props.keyboardType,
              ...props,
            }}
          />
        )}
      />

      {props.helpText && (
        <View style={styles.space}>
          <AppTextBody style={{ fontSize: moderateScale(12) }}>
            {props.helpText}
          </AppTextBody>
        </View>
      )}

      <RenderErrorMessage
        serverErrors={props.serverErrors}
        errors={props.errors}
        name={props.name}
      />
    </>
  );
};

const styles = StyleSheet.create({
  space: {
    // marginBottom: verticalScale(5),
  },
  errorColor: {
    color: defaultTheme.DANGER_COLOR,
  },
});
