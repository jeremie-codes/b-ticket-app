import { Text, StyleSheet } from "react-native";
import React from "react";
import { TextType } from "src/types";
import { SIZES } from "src/constants/App";
import { defaultTheme } from "src/themes";
import { moderateScale } from "src/constants/Metric";

export const AppTextBody: React.FC<TextType> = (props: TextType) => {
  return (
    <Text
      numberOfLines={props.numberOfLines}
      style={[styles.textBody, props.style]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textBody: {
    fontFamily: "Epilogue_400Regular",
    fontSize: moderateScale(SIZES.base),
    color: defaultTheme.BODY_TEXT_COLOR,
    lineHeight: moderateScale(20),
  },
});
