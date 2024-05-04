import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import React, { PropsWithChildren } from "react";
import { defaultTheme } from "src/themes";
import { SIZES } from "src/constants/App";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { AppIcon, AppIconType } from "src/components/ui/icons/AppIcon";

type ButtonType = PropsWithChildren<{
  onPress?: () => void;
  isSecondary?: boolean;
  noBackground?: boolean;
  style?: {};
  backgroundColor?: string;
  textColor?: string;
  icon?: AppIconType;
  isSubmitting?: boolean;
  radius?: number;
  padding?: number;
}>;

export const AppButton: React.FC<ButtonType> = (props: ButtonType) => {
  const noBackgroundStyle = props.noBackground && {
    borderWidth: moderateScale(1),
    borderColor: defaultTheme.MUTED_TEXT_COLOR,
  };
  const buttonStyle = [
    styles.buttonInnerContainer,
    noBackgroundStyle,
    {
      backgroundColor: props.isSecondary
        ? defaultTheme.SECONDARY_BUTTON_BACKGROUND_COLOR
        : props.backgroundColor
        ? props.backgroundColor
        : props.noBackground
        ? "transparent"
        : defaultTheme.PRIMARY_BUTTON_BACKGROUND_COLOR,
      paddingVertical: props.icon
        ? verticalScale(SIZES.base - 7)
        : verticalScale(SIZES.base - 5),
      borderRadius: props.radius
        ? moderateScale(props.radius)
        : moderateScale(SIZES.base * 2),
      paddingHorizontal: props.padding
        ? moderateScale(props.padding)
        : horizontalScale(SIZES.base + 10),
    },
  ];

  const textButtonStyle = [
    styles.buttonText,

    {
      color: props.isSecondary
        ? defaultTheme.SECONDARY_BUTTON_TEXT_COLOR
        : props.textColor
        ? props.textColor
        : defaultTheme.PRIMARY_TEXT_COLOR,
    },
  ];

  let outerStyle = styles.buttonOuterContainer;

  if (props.style) {
    outerStyle = {
      ...styles.buttonOuterContainer,
      ...props.style,
    };
  }

  return (
    <View style={outerStyle}>
      <Pressable
        onPress={props.onPress}
        style={({ pressed }) =>
          pressed
            ? [buttonStyle, { opacity: moderateScale(SIZES.opacity) }]
            : buttonStyle
        }
      >
        {props.children ? (
          <View style={[props.icon ? styles.buttonWithIcon : null]}>
            <View style={styles.icon}>
              {props.icon && <AppIcon {...props.icon} />}
            </View>
            <View style={[props.icon ? styles.textContainer : null]}>
              <View style={[!props.icon ? styles.defaultTextContainer : null]}>
                {/*  <View>
                {props.isSubmitting && (
                  <ActivityIndicator size="small" color="white" />
                )}
              </View> */}
                <View>
                  <Text style={textButtonStyle}>{props.children}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.icon}>
            {props.icon && <AppIcon {...props.icon} />}
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    overflow: "hidden",
  },
  buttonInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontFamily: "Epilogue_600SemiBold",
    fontSize: Platform.OS === "android" ? moderateScale(18) : moderateScale(16),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    textAlign: "center",
    fontWeight: "900",
  },
  buttonWithIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {},
  textContainer: {
    flex: 1,
  },
  defaultTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
  },
});
