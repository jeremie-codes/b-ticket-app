import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AppLink } from "src/components";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { Auth } from "src/services/authService";
import { defaultTheme } from "src/themes";
import { AccountScreenProps } from "src/types/navigator";
import { AppForm } from "src/components/form/AppForm";
import { ServerErrorType } from "src/components/form/helpers/InputCheckError";
import { User } from "src/services/userService";
import { UserType } from "src/types/auth";
import { createServerErrorArray } from "src/components/events/ExtractFormErrorsFromResponse";
import AccountProfilePicture from "src/components/account/AccountProfilePicture";
import AppWrapper from "src/components/AppWrapper";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";

export const AccountScreen = ({ navigation }: AccountScreenProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "Mon Profil",
      headerStyle: {
        backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
      },

      headerBackTitleVisible: false,
      headerTitleAlign: "center",
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "right",
      },
    });
  }, [navigation]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const [serverErrors, setServerErrors] = useState<ServerErrorType>();

  useEffect(() => {
    setServerErrors(undefined);
  }, []);

  const { dispatch } = useContext(AuthContext);
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const queryKey = ["user", "profile"];

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: queryKey,
    staleTime: 0,
    enabled: true,
    queryFn: () => {
      toggleLoading(true);
      return User.getProfile(true);
    },
    onSettled(data) {
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (data.success) {
        dispatch({ type: "UPDATE_USER", payload: data.data });
      }

      toggleLoading(false);
    },
  });

  const user: UserType = data?.data || {};

  const { mutateAsync: onUpdateProfile } = useMutation({
    mutationFn: async (data: any) => await User.storeProfile(data, true),
    onMutate: () => {
      setServerErrors(undefined);
      toggleLoading(true);
    },
    onSettled: (data) => {
      if (data.success) {
        const user = data.data[1];
        const userWithProfile = {
          ...user,
          profile: data.data[0],
        };

        dispatch({ type: "UPDATE_USER", payload: userWithProfile });
        toggleLoading(false);
        return;
      }
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (!data.success && data.errors) {
        setServerErrors(createServerErrorArray(data.errors));
        toggleLoading(false);
        return;
      }
    },
  });

  const { mutateAsync: onLogout } = useMutation({
    mutationFn: async () => await Auth.logout(true),
    onMutate: () => {
      dispatch({ type: "LOGIN_START" });
    },
    onSettled: (data) => {
      if (data.success) {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
    },
  });

  const { mutateAsync: onDeleteAccount } = useMutation({
    mutationFn: async () => await Auth.deleteAccount(true),
    onMutate: () => {
      dispatch({ type: "LOGIN_START" });
    },
    onSettled: (data) => {
      if (data.success) {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
    },
  });

  const onLogoutHandler = async () => {
    toggleLoading(true);
    await onLogout().finally(() => toggleLoading(false));
  };

  const onDeleteAccountHandler = async () =>
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr? cette action est irreversible !",
      [
        {
          text: "Supprimer",
          onPress: async () => {
            toggleLoading(true);
            await onDeleteAccount().finally(() => toggleLoading(false));
          },
        },
        {
          text: "Annuler",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  return (
    <AppWrapper>
      {!isFetching && !isLoading && !data?.success && (
        <FallbackFetchError message={data?.message} onPress={refetch} />
      )}

      {!isLoading && data?.success && (
        <Pressable onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
          >
            <Pressable
              style={{
                flexGrow: 1,
              }}
            >
              <AccountProfilePicture user={user} handleGoBack={handleGoBack} />

              <View
                style={{
                  justifyContent: "space-between",
                  paddingTop: verticalScale(20),
                  flexGrow: 1,
                }}
              >
                <View>
                  <AppForm
                    hasSubmitButton={true}
                    buttonLabel="Mettre à jour"
                    mutation={onUpdateProfile}
                    serverErrors={serverErrors}
                    defaultValues={{
                      email: user.email,
                      name: user.name,
                      first_name: user.profile?.first_name,
                      last_name: user.profile?.last_name,
                    }}
                    mode="onSubmit"
                    fields={[
                      {
                        placeholder: "Prénom",
                        name: "first_name",
                        rules: {
                          maxLength: {
                            value: 50,
                            message:
                              "Le champ Nom ne doit pas contenir plus de 50 caractères",
                          },
                        },
                        col: 2,
                      },
                      {
                        placeholder: "Nom",
                        name: "last_name",
                        col: 2,

                        rules: {
                          maxLength: {
                            value: 50,
                            message:
                              "Le champ Nom ne doit pas contenir plus de 50 caractères",
                          },
                        },
                      },
                      {
                        placeholder: "Nom d'utilisateur",
                        name: "name",
                        rules: {
                          required: {
                            value: true,
                            message: "Le Nom est un champ obligatoire",
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
                              "Le champ E-mail ne doit pas contenir plus de 50 caractères",
                          },
                        },
                      },
                      {
                        placeholder: "Mot de passe",
                        name: "password",
                        rules: {
                          maxLength: {
                            value: 50,
                            message:
                              "Le champ mot de passe ne doit pas contenir plus de 50 caractères",
                          },
                        },
                        // helpText: "Laisser vide pour conserver votre actuel mot de passe",
                        secureTextEntry: true,
                        col: 1,
                      },
                    ]}
                  />
                </View>

                <View style={styles.bottom}>
                  <View>
                    <AppLink
                      textStyle={styles.bottomText}
                      onPress={onLogoutHandler}
                    >
                      Déconnexion
                    </AppLink>
                  </View>
                  <View>
                    <AppLink
                      textStyle={styles.bottomText}
                      onPress={onDeleteAccountHandler}
                    >
                      Supprimer mon compte
                    </AppLink>
                  </View>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </Pressable>
      )}
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    //justifyContent: "space-between",
    flexGrow: 1,
  },

  bottom: {
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(12),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(15),
  },
  bottomText: {
    fontSize: moderateScale(14),
  },
});
