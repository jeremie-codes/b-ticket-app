import { FC, PropsWithChildren } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SIZES } from "src/constants/App";
import { moderateScale } from "src/constants/Metric";

type ClickableWrapperType = PropsWithChildren<{
  onPress?: () => void;
  style?: object;
}>;
export const ClickableWrapper: FC<ClickableWrapperType> = ({
  onPress,
  style,
  children,
}: ClickableWrapperType) => {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [styles.link, style, { opacity: moderateScale(SIZES.opacity) }]
          : [styles.link, style]
      }
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  link: {},
});
