import { View, StyleSheet } from "react-native";
import React, { PropsWithChildren } from "react";
import { SIZES } from "src/constants/App";
import { moderateScale, verticalScale } from "src/constants/Metric";

type BlockWithSeparator = PropsWithChildren<{
  style?: object;
  cost?: number;
}>;
export const AppBlockWithSeparator: React.FC<BlockWithSeparator> = ({
  cost = 30,
  children,
  style,
}) => {
  return (
    <View
      style={[
        style,
        cost
          ? { marginBottom: verticalScale(cost) }
          : {
              marginBottom: verticalScale(SIZES.h1 - 2),
            },
      ]}
    >
      {children}
    </View>
  );
};
