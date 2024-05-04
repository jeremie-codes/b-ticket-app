import { StyleSheet, Text, View } from "react-native";
import { horizontalScale, moderateScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";

export const LoginSocialSeparator = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.orText}>ou</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: horizontalScale(1),
    backgroundColor: defaultTheme.SEPARATOR_COLOR,
  },
  orText: {
    marginHorizontal: horizontalScale(10),
    fontSize: moderateScale(18),
    color: defaultTheme.SEPARATOR_TEXT_COLOR,
  },
});
