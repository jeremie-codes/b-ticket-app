import { StyleSheet, View } from "react-native";
import { FC, PropsWithChildren } from "react";
import { AppTextLeading } from "./ui/texts/AppTextLeading";
import { verticalScale } from "src/constants/Metric";

type HeaderTitleType = PropsWithChildren<{
  style?: object;
  buttonTextStyle?: object;
}>;

export const HeaderTitle: FC<HeaderTitleType> = ({
  children,
  style,
  buttonTextStyle,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <AppTextLeading style={buttonTextStyle}>{children}</AppTextLeading>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: verticalScale(10),
  },
});
