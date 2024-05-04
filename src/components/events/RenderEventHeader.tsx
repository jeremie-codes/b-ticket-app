import { StyleSheet, View } from "react-native";
import { AppLink } from "src/components";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { verticalScale } from "src/constants/Metric";
import { moderateScale } from "src/constants/Metric";
import { SIZES } from "src/constants/App";
type RecentEventHeaderType = {
  title: string;
  actionText?: string;
  actionOnPress: () => void;
};

export const RenderEventHeader = ({
  title,
  actionText,
  actionOnPress,
}: RecentEventHeaderType) => {
  return (
    <View style={styles.eventHeaderContainer}>
      <View>
        <AppTextLeading style={styles.eventHeaderLeftTitleText}>
          {title}
        </AppTextLeading>
      </View>
      {actionText && (
        <View>
          <AppLink
            onPress={actionOnPress}
            textStyle={styles.eventHeaderRightTitleText}
          >
            {actionText}
          </AppLink>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: verticalScale(20),
    marginBottom: verticalScale(8),
  },
  eventHeaderRightTitleText: {
    fontSize: moderateScale(13),
  },
  eventHeaderLeftTitleText: {
    fontSize: moderateScale(SIZES.h2),
  },
});
