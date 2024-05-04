import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { defaultTheme } from "src/themes";
import { horizontalScale, verticalScale } from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import AppWrapper from "src/components/AppWrapper";
import { HeaderTitle } from "src/components";
import { AppForm } from "src/components/form";
import { ServerErrorType } from "src/components/form/helpers/InputCheckError";
import { useMutation } from "@tanstack/react-query";
import { createServerErrorArray } from "src/components/events/ExtractFormErrorsFromResponse";
import { Auth } from "src/services/authService";
import { GuestStackProps } from "src/types/navigator";

export const ForgotPassword: React.FC<GuestStackProps> = ({
  navigation,
}: GuestStackProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
      headerBackTitleVisible: false,
      headerLeftContainerStyle: {
        paddingLeft: horizontalScale(11),
      },
      headerStyle: {
        backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  const handleResetPasswordConfirmationPress = () => {
    navigation.navigate("ResetPasswordConfirmation");
  };

  const [serverErrors, setServerErrors] = useState<ServerErrorType>();

  const { mutateAsync: onForgot } = useMutation({
    mutationFn: async (data: any) => await Auth.forgot(data, true),
    onMutate: () => {
      setServerErrors(undefined);
    },
    onSuccess: (data) => {
      if (data && data.success) {
        handleResetPasswordConfirmationPress();
        return;
      }

      if (data && !data.success && data.errors) {
        setServerErrors(createServerErrorArray(data.errors));
      }
      return;
    },
  });

  return (
    <AppWrapper>
      <Pressable style={{ flexGrow: 1 }} onPress={Keyboard.dismiss}>
        <HeaderTitle>Mot de passe oublié</HeaderTitle>
        <View style={styles.formContainer}>
          <AppForm
            hasSubmitButton={true}
            buttonLabel="Réinitialiser le mot de passe"
            mutation={onForgot}
            serverErrors={serverErrors}
            mode="onSubmit"
            fields={[
              {
                placeholder: "E-mail",
                name: "email",
                keyboardType: "email-address",
                rules: {
                  required: {
                    value: true,
                    message: "L'E-mail est un champ obligatoire",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      "Le champ E-mail n'est doit pas contenir plus de 50 caractères",
                  },
                },
              },
            ]}
          />
        </View>
      </Pressable>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  navigatorRightButton: {
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    paddingLeft: horizontalScale(SIZES.base + 4 - 10),
  },
  formContainer: {
    marginTop: verticalScale(SIZES.h1),
  },
  formRow: {},
  baseSpacing: {
    marginVertical: verticalScale(SIZES.base),
  },
});
