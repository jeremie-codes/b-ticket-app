import { Pressable, StyleSheet, View } from "react-native";
import { FC, PropsWithChildren } from "react";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { defaultTheme } from "src/themes";
import { SIZES } from "src/constants/App";
import { moderateScale } from "src/constants/Metric";

type AppLinkType = PropsWithChildren<{
  onPress?: () => void;
  textStyle?: object;
  linkStyle?: object;
  numberOfLines?: number;
}>;

export const AppLink: FC<AppLinkType> = ({
  children,
  onPress,
  textStyle,
  linkStyle,
  numberOfLines,
}) => {
  const linkStyles = [styles.linkStyle, linkStyle];
  return (
    <View>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [linkStyles, { opacity: moderateScale(SIZES.opacity) }]
            : linkStyles
        }
        onPress={onPress}
      >
        <AppTextBody
          numberOfLines={numberOfLines}
          style={[styles.text, textStyle]}
        >
          {children}
        </AppTextBody>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: defaultTheme.SECONDARY_TEXT_COLOR,
  },
  linkStyle: {},
});
