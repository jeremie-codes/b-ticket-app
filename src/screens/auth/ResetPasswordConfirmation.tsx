import { StyleSheet, View } from "react-native";
import React from "react";
import AppWrapper from "src/components/AppWrapper";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import { AppBlockWithSeparator } from "src/components";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { AppButton } from "src/components/ui/buttons";
import { GuestStackProps } from "src/types/navigator";

export const ResetPasswordConfirmation: React.FC<GuestStackProps> = ({
  navigation,
}: GuestStackProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <AppWrapper
      style={{
        justifyContent: "flex-end",
        paddingBottom: verticalScale(SIZES.base),
        paddingTop: 0,
      }}
    >
      <AppBlockWithSeparator>
        <AppTextLeading>Veuillez consulter votre courrier</AppTextLeading>
      </AppBlockWithSeparator>
      <AppBlockWithSeparator>
        <AppTextBody>
          Vous avez reçu une instruction pour réinitialiser votre mot de passe.
        </AppTextBody>
      </AppBlockWithSeparator>
      <View style={styles.buttonContainer}>
        <AppButton onPress={handleLoginPress} style={styles.buttonOuter}>
          Se connecter
        </AppButton>
      </View>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    gap: moderateScale(SIZES.base / 2 + 2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonOuter: {
    flex: 1,
  },
});
