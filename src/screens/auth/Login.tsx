import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { SIZES } from "src/constants/App";
import { defaultTheme } from "src/themes";
import { AppButton } from "src/components/ui/buttons";
import { AppForm } from "src/components/form";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { AppLink, HeaderTitle, LoginSocialSeparator } from "src/components";
import AppWrapper from "src/components/AppWrapper";
import { ServerErrorType } from "src/components/form/helpers/InputCheckError";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "src/contexts/AuthContext";
import { Auth } from "src/services/authService";
import { createServerErrorArray } from "src/components/events/ExtractFormErrorsFromResponse";
import { GuestStackProps } from "src/types/navigator";

export const Login: React.FC<GuestStackProps> = ({
  navigation,
}: GuestStackProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerBackTitleVisible: false,
      headerLeftContainerStyle: {
        paddingLeft: horizontalScale(11),
      },
      headerTitle: "",
      headerStyle: {
        backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  };

  const [serverErrors, setServerErrors] = useState<ServerErrorType>();
  const { dispatch } = useContext(AuthContext);

  const { mutateAsync: onLogin } = useMutation({
    mutationFn: async (data: any) => await Auth.login(data, true),
    onMutate: () => {
      setServerErrors(undefined);
      dispatch({ type: "LOGIN_START" });
    },
    onSuccess: (data) => {
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
      <Pressable style={{ flexGrow: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}
          >
            <View>
              <HeaderTitle>Connexion</HeaderTitle>
             {/*  <View style={styles.socialContainer}>
                <View style={styles.socialNetworkSpaceing}>
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
                <View style={styles.socialNetworkSpaceing}>
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
              </View>
              <View style={styles.separatorContainer}>
                <LoginSocialSeparator />
              </View> */}
              <AppForm
                hasSubmitButton={true}
                buttonLabel="Se connecter"
                mutation={onLogin}
                serverErrors={serverErrors}
                mode="onSubmit"
                fields={[
                  {
                    placeholder: "E-mail",
                    keyboardType: "email-address",
                    name: "email",
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
                  },
                ]}
              />

              <View style={[styles.formRow, styles.forgotPassword]}>
                <AppLink
                  onPress={handleForgotPasswordPress}
                  textStyle={[styles.actionText, styles.actionTextColor]}
                >
                  Mot de passe oublié ?
                </AppLink>
              </View>
            </View>
            <View style={[styles.formRow, styles.dontAccountWrapper]}>
              <View>
                <AppTextBody style={[styles.actionText]}>
                  Vous n'avez pas de compte?
                </AppTextBody>
              </View>
              <View>
                <AppLink
                  onPress={handleSignUpPress}
                  textStyle={[styles.actionText, styles.actionTextColor]}
                >
                  S'inscrire
                </AppLink>
              </View>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  blockContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {},
  formRow: {},
  forgotPassword: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(SIZES.base),
  },
  actionText: {
    fontSize: moderateScale(SIZES.base),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  actionTextColor: {
    color: defaultTheme.SECONDARY_TEXT_COLOR,
  },
  dontAccountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(SIZES.base / 2),
    marginTop: verticalScale(SIZES.base * 2),
    marginBottom: verticalScale(SIZES.base),
  },
  baseSpacing: {
    marginVertical: verticalScale(SIZES.base),
  },
  navigatorRightButton: {
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    paddingLeft: horizontalScale(SIZES.base + 4 - 10),
  },
  scrollViewContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  socialNetworkSpaceing: {
    marginVertical: verticalScale(SIZES.base / 2),
  },
  socialContainer: {
    marginVertical: verticalScale(SIZES.base),
  },
  facebookButton: {
    backgroundColor: defaultTheme.FACEBOOK_BACKGROUND_COLOR,
  },
  googleButton: {
    backgroundColor: defaultTheme.GOOGLE_BACKGROUND_COLOR,
  },
  googleTextButton: {
    color: defaultTheme.MUTED_TEXT_COLOR,
  },
  separatorContainer: {
    marginBottom: verticalScale(SIZES.base + 6),
  },
});
