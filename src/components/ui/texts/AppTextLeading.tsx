import { Text, StyleSheet } from "react-native";
import React from "react";
import { TextType } from "src/types";
import { SIZES } from "src/constants/App";
import { defaultTheme } from "src/themes";
import { moderateScale } from "src/constants/Metric";

export const AppTextLeading: React.FC<TextType> = (props: TextType) => {
  return (
    <Text
      numberOfLines={props.numberOfLines}
      style={[styles.textLeading, props.style]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textLeading: {
    fontFamily: "Epilogue_700Bold",
    fontSize: moderateScale(SIZES.h1),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    lineHeight: moderateScale(35),
  },
});
