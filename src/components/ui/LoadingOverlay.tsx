import { View, StyleSheet, ActivityIndicator } from "react-native";
import { AppTextBody } from "./texts/AppTextBody";
import { defaultTheme } from "src/themes";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";

function LoadingOverlay() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="small" color="white" />
        <AppTextBody
          style={{
            color: "white",
            marginTop: 8,
            textAlign: "center",
            fontSize: 11,
          }}
        >
          CHARGEMENT...
        </AppTextBody>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Use an rgba value with desired opacity
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: defaultTheme.FORM_BACKGROUND_COLOR,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    borderRadius: moderateScale(10),
    zIndex: 999,
  },
});

export default LoadingOverlay;
