import { StyleSheet, View } from "react-native";
import { AppInputControllerType } from "./AppInputController";
import { ValidationMode, useForm } from "react-hook-form";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { AppInputController } from "src/components/form/AppInputController";
import { SetStateAction, useEffect, Fragment, useContext } from "react";
import { ServerErrorType } from "./helpers/InputCheckError";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import { AppButton } from "../ui/buttons";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";

type AppFormType = {
  fields: AppInputControllerType[];
  mode?: keyof ValidationMode;
  mutation?: UseMutateAsyncFunction<any, unknown, void, unknown>;
  resetFields?: {};
  hasSubmitButton?: boolean;
  buttonLabel?: string;
  defaultValues?: any;
  serverErrors?: SetStateAction<ServerErrorType>;
};

export const AppForm: React.FC<AppFormType> = (props: AppFormType) => {
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const {
    fields,
    defaultValues,
    mode = "onBlur",
    mutation,
    resetFields,
    hasSubmitButton,
    buttonLabel = "Envoyer",
    serverErrors,
  } = props;

  // const { control, reset, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm({ mode, defaultValues });
  const { control, reset, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm({ mode: "onSubmit", defaultValues});

  const onHandleSubmit = async (data: any) => {
    console.log('data mutation');
    
    if (mutation) {
      await mutation(data);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful && !serverErrors && resetFields) {
      reset(resetFields);
    }
  }, [isSubmitSuccessful, serverErrors]);

  useEffect(() => {
    toggleLoading(isSubmitting);
  }, [isSubmitting]);

  return (
    <Fragment>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: moderateScale(11),
        }}
      >
        {fields.map((field, index) => {
          const col = field.col === 2 ? { width: "48%" } : { width: "99.2%" };
          return (
            <View key={index} style={col}>
              <AppInputController
                serverErrors={serverErrors}
                errors={errors}
                control={control}
                name={field.name}
                placeholder={field.placeholder}
                //defaultValue={defaultValues[field.name] || field.defaultValue}
                rules={field.rules}
                isEditable={field.isEditable}
                invalid={field.invalid}
                label={field.label}
                secureTextEntry={field.secureTextEntry}
                helpText={field.helpText}
                keyboardType={field.keyboardType}
              />
            </View>
          );
        })}
      </View>

      {hasSubmitButton && (
        <View style={[styles.formRow, styles.baseSpacing]}>
          <AppButton
            onPress={handleSubmit(onHandleSubmit)}
            isSubmitting={isSubmitting}
          >
            {buttonLabel}
          </AppButton>
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  formRow: {},
  baseSpacing: {
    marginVertical: verticalScale(SIZES.base),
  },
});
