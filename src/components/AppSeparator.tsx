import React from "react";
import { StyleSheet, View } from "react-native";
import { horizontalScale, moderateScale, verticalScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";

type AppSeparatorType = {
  cost?: number;
  style?: object;
};
export const AppSeparator: React.FC<AppSeparatorType> = ({ style, cost }) => {
  const margin = cost
    ? {
        marginVertical: verticalScale(cost),
      }
    : {
        marginVertical: 0,
      };
  const separatorStyle = [styles.line, style, margin];
  return <View style={separatorStyle} />;
};

const styles = StyleSheet.create({
  line: {
    height: horizontalScale(1),
    backgroundColor: defaultTheme.SEPARATOR_COLOR,
  },
});
