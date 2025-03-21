import { View, StyleSheet, ImageBackground } from "react-native";
import { AppButton } from "src/components/ui/buttons";
import { AppBlockWithSeparator } from "src/components";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { SIZES } from "src/constants/App";

import { moderateScale, verticalScale } from "src/constants/Metric";
import AppWrapper from "src/components/AppWrapper";
import { GuestStackProps } from "src/types/navigator";

export default function Welcome({ navigation }: GuestStackProps) {
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={{ flex: 1 }}>
      <AppWrapper
        style={{
          justifyContent: "flex-end",
          paddingBottom: verticalScale(SIZES.base),
          paddingTop: 0,
        }}
      >
        <ImageBackground style={{ flex: 1, position: "absolute", top: -20, width: SIZES.width, height:SIZES.height+20, left: 0 }} source={require('../assets/img/muasi.jpg')} />
        <AppBlockWithSeparator>
          <AppTextLeading>Retrouvez vos événements préférés.</AppTextLeading>
        </AppBlockWithSeparator>
        <AppBlockWithSeparator>
          <AppTextBody>
            B-Ticket est là pour vous aider à trouver les meilleurs
            événements en fonction de vos intérêts.
          </AppTextBody>
        </AppBlockWithSeparator>
        <View style={styles.buttonContainer}>
          <AppButton onPress={handleLoginPress} style={styles.buttonOuter}>
            Se connecter
          </AppButton>
          <AppButton
            onPress={handleSignUpPress}
            style={styles.buttonOuter}
            isSecondary
          >
            S'inscrire
          </AppButton>
        </View>
      </AppWrapper>
    </View>
  );
}

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
