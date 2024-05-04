import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import AppWrapper from "src/components/AppWrapper";
import { HeaderTitle, LoginSocialSeparator } from "src/components";
import { AppButton } from "src/components/ui/buttons";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { SIZES } from "src/constants/App";
import { AppForm } from "src/components/form";
import { AppLink } from "src/components/AppLink";
import { ServerErrorType } from "src/components/form/helpers/InputCheckError";
import { useMutation } from "@tanstack/react-query";
import { Auth } from "src/services/authService";
import { AuthContext } from "src/contexts/AuthContext";
import { createServerErrorArray } from "src/components/events/ExtractFormErrorsFromResponse";
import { GuestStackProps } from "src/types/navigator";

export const SignUp: React.FC<GuestStackProps> = ({
  navigation,
}: GuestStackProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleWelcomePress = () => {
    navigation.goBack();
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const [serverErrors, setServerErrors] = useState<ServerErrorType>();
  const { dispatch } = useContext(AuthContext);
  const { mutateAsync: onSignUp } = useMutation({
    mutationFn: async (data: any) => await Auth.register(data, true),
    onMutate: () => {
      setServerErrors(undefined);
      dispatch({ type: "LOGIN_START" });
    },
    onSettled: (data) => {
      if (data.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { ...data.data.user, token: data.data.token },
        });
        return;
      }

      if (!data.success && data.errors) {
        setServerErrors(createServerErrorArray(data.errors));
      }
      dispatch({ type: "LOGIN_FAILURE", payload: data.message });
      return;
    },
  });

  return (
    <AppWrapper>
      <Pressable onPress={Keyboard.dismiss}>
        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.socialContainer}>
            <HeaderTitle style={{ paddingTop: verticalScale(SIZES.base) }}>
              S'inscrire
            </HeaderTitle>
          {/*   <View>
              <View style={styles.socialTop}>
                <View>
                  <AppButton
                    icon={{
                      name: "facebook-with-circle",
                      type: "entypo",
                      size: moderateScale(22),
                      color: defaultTheme.PRIMARY_TEXT_COLOR,
                    }}
                    backgroundColor={defaultTheme.FACEBOOK_BACKGROUND_COLOR}
                  >
                    Continuer avec Facebook
                  </AppButton>
                </View>
                <View style={styles.topSocialTextContainer}>
                  <AppTextBody style={styles.topSocialText}>
                    Inscrivez-vous avec Facebook pour connaître les événements
                    auxquels vos amis participent.
                  </AppTextBody>
                </View>
              </View>
              <View>
                <LoginSocialSeparator />
              </View>
              <View style={styles.socialBottomContainer}>
                <AppButton
                  icon={{
                    name: "logo-google",
                    type: "ionicons",
                    size: moderateScale(22),
                    color: defaultTheme.GOOGLE_ICON_COLOR,
                  }}
                  backgroundColor={defaultTheme.GOOGLE_BACKGROUND_COLOR}
                  textColor={defaultTheme.GOOGLE_TEXT_COLOR}
                >
                  Continuer avec Google
                </AppButton>
              </View>
            </View> */}
          </View>
          <View style={styles.formContainer}>
            <View>
              <HeaderTitle
                buttonTextStyle={{
                  fontFamily: "Epilogue_300Light",
                }}
              >
                S'inscrire par e-mail
              </HeaderTitle>
            </View>
            <AppForm
              hasSubmitButton={true}
              buttonLabel="S'inscrire"
              mutation={onSignUp}
              serverErrors={serverErrors}
              mode="onSubmit"
              fields={[
                {
                  placeholder: "Nom d'utilisateur",
                  name: "name",
                  rules: {
                    required: {
                      value: true,
                      message: "L'Nom est un champ obligatoire",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "Le champ Nom n'est doit pas contenir plus de 50 caractères",
                    },
                  },
                },
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
                {
                  placeholder: "Mot de passe",
                  name: "password",
                  rules: {
                    required: {
                      value: true,
                      message: "Le Mot de passe est un champ obligatoire",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "Le champ mot de passe n'est doit pas contenir plus de 50 caractères",
                    },
                  },
                  secureTextEntry: true,
                  col: 1,
                },
              ]}
            />

            <View style={[styles.cancelButton]}>
              <AppLink
                onPress={handleWelcomePress}
                textStyle={{ color: defaultTheme.SECONDARY_BUTTON_TEXT_COLOR }}
              >
                Annuler
              </AppLink>
            </View>

            <View style={[styles.formRow, styles.actionContainer]}>
              <View style={styles.actionTextContainer}>
                <AppTextBody style={{ color: defaultTheme.PRIMARY_TEXT_COLOR }}>
                  Vous avez un compte?
                </AppTextBody>
                <AppLink
                  textStyle={styles.textColor}
                  onPress={handleLoginPress}
                >
                  Se connecter
                </AppLink>
              </View>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    justifyContent: "space-between",
  },
  socialContainer: {},
  socialTop: {
    marginTop: verticalScale(SIZES.base + 5),
    justifyContent: "center",
  },
  topSocialTextContainer: {
    marginVertical: verticalScale(SIZES.base + 5),
    justifyContent: "center",
    alignItems: "center",
  },
  topSocialText: {
    textAlign: "center",
  },

  socialBottomContainer: {
    marginVertical: verticalScale(SIZES.base + 15),
  },
  formContainer: {},
  formRow: {},
  baseSpacing: {
    marginVertical: verticalScale(SIZES.base),
  },
  actionText: {
    fontSize: moderateScale(SIZES.base - 3),
    color: defaultTheme.MUTED_TEXT_COLOR,
    flexWrap: "wrap",
  },
  actionTextColor: {
    color: defaultTheme.SECONDARY_TEXT_COLOR,
  },
  actionContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(SIZES.base / 2),
    marginTop: verticalScale(SIZES.base * 2),
    marginBottom: verticalScale(SIZES.base),
  },
  textColor: {
    color: defaultTheme.SECONDARY_TEXT_COLOR,
    fontSize: moderateScale(SIZES.base),
  },
  actionTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: verticalScale(SIZES.base - 6),
  },
});
