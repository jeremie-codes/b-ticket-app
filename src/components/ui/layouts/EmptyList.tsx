import { StyleSheet, View } from "react-native";
import React from "react";
import { horizontalScale } from "src/constants/Metric";
import { moderateScale } from "src/constants/Metric";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";

type EmptyListType = {
  title: string;
  subtitle?: string;
};

const EmptyList: React.FC<EmptyListType> = ({
  title,
  subtitle,
}: EmptyListType) => {
  return (
    <View style={styles.notRecord}>
      <View style={styles.title}>
        <AppTextLeading style={styles.textCenter}>{title}</AppTextLeading>
      </View>
      {subtitle && (
        <View style={styles.subtitle}>
          <AppTextBody style={styles.textCenter}>{subtitle}</AppTextBody>
        </View>
      )}
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  notRecord: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(16),
    gap: moderateScale(16),
  },
  title: {},
  subtitle: {},
  textCenter: {
    textAlign: "center",
  },
});
