import { StyleSheet, View } from "react-native";
import React from "react";
import { ClickableWrapper } from "src/components/ClickableWrapper";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { defaultTheme } from "src/themes";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import { AppIcon } from "../icons";

type BadgeType = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  fullFlex?: boolean;
};

export const AppBadge: React.FC<BadgeType> = ({
  label,
  active,
  onPress,
  fullFlex,
}) => {
  const activeContainerStyle = {
    borderColor: defaultTheme.SECONDARY_BACKGROUND_COLOR,
    backgroundColor: defaultTheme.SECONDARY_BACKGROUND_COLOR,
  };
  const containerStyle = [
    styles.container,
    fullFlex ? styles.fullFlex : {},
    active ? activeContainerStyle : {},
  ];
  return (
    <ClickableWrapper style={containerStyle} onPress={onPress}>
      <View style={styles.wrapper}>
        <AppTextBody style={styles.label}>{label}</AppTextBody>
        {active && (
          <AppIcon
            type="fontAwesome5"
            size={12}
            name="times"
            color={defaultTheme.PRIMARY_TEXT_COLOR}
          />
        )}
      </View>
    </ClickableWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: defaultTheme.BODY_TEXT_COLOR,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(SIZES.base * 2),
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(10),
  },
  label: {
    fontSize: moderateScale(SIZES.base - 3),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  fullFlex: {
    flex: 1,
  },
});
