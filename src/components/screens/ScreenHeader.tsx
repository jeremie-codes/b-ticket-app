import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SIZES } from "src/constants/App";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { AppTextBody } from "../ui/texts/AppTextBody";

type ScreenHeaderType = {
  title?: string;
  subtitle?: string;
  image?: ReactNode;
};

export const ScreenHeader = ({ title, subtitle, image }: ScreenHeaderType) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerLeftTopTitle}>
          <AppTextBody style={styles.headerLeftTopTitleText}>
            {title}
          </AppTextBody>
        </View>
        {subtitle && (
          <View style={styles.headerLeftBottomTitle}>
            <AppTextBody style={styles.headerLeftBottomTitleText}>
              {subtitle}
            </AppTextBody>
          </View>
        )}
      </View>
      {image && (
        <View style={styles.headerRight}>
          <View style={styles.headerRightIconContainer}>{image}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: verticalScale(10),
  },
  headerLeft: {
    justifyContent: "center",
  },
  headerRight: {},
  headerLeftTopTitle: {},
  headerLeftTopTitleText: {
    fontSize: moderateScale(13),
  },
  headerLeftBottomTitle: {},
  headerLeftBottomTitleText: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontSize: moderateScale(SIZES.h4 + 2),
    fontWeight: "700",
  },

  headerRightIconContainer: {},
});
