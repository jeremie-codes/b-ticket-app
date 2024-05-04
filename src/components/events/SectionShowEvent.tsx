import { StyleSheet, View } from "react-native";
import React, { PropsWithChildren } from "react";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { defaultTheme } from "src/themes";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { AppLink } from "../AppLink";

type IPros = PropsWithChildren<{
  title: string;
  actionTitle?: string;
  actionOnClick?: () => void;
  style?: object;
  selfStyle?: object;
}>;

export const SectionShowEvent: React.FC<IPros> = ({
  children,
  title,
  style,
  actionOnClick,
  actionTitle,
  selfStyle,
}) => {
  return (
    <View style={[styles.sectionContainer, style]}>
      <View style={styles.sectionTitleContainer}>
        <AppTextLeading style={styles.sectionTitle}>{title}</AppTextLeading>
        {actionTitle && actionOnClick && (
          <AppLink onPress={actionOnClick}>{actionTitle}</AppLink>
        )}
      </View>
      <View style={[styles.selfSection, selfStyle]}>
        <View>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(10),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    color: defaultTheme.BODY_TEXT_COLOR,
    fontFamily: "Epilogue_400Regular",
    lineHeight: moderateScale(28),
  },
  selfSection: {},
});
