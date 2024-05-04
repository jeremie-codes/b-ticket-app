import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ReactNode } from "react";
import { horizontalScale, verticalScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { SIZES } from "src/constants/App";

interface AppWrapperProps {
  children: ReactNode;
  style?: object;
}

export default function AppWrapper({ children, style }: AppWrapperProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

        <SafeAreaView style={styles.container}>
          <View style={[styles.pageContainer, style]}>{children}</View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(SIZES.base + 4),
    paddingTop: verticalScale(SIZES.base),
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
  },
});
