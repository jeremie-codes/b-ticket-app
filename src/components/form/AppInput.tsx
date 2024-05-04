import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { PropsWithChildren } from "react";
import { defaultTheme } from "src/themes";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { SIZES } from "src/constants/App";

type AppInputType = PropsWithChildren<{
  label?: string;
  style?: object;
  placeholder?: string;
  isInvalid?: boolean;
  isMultiline?: boolean;
  autoCapitalize?: boolean;
  isEditable?: boolean;
  selectTextOnFocus?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  inputConfig?: object;
  onChangeText?: (value: string) => void;
  text?: string;
  icon?: React.ReactNode;
}>;

export const AppInput: React.FC<AppInputType> = (props: AppInputType) => {
  let inputStyles = styles.textInput;

  if (props.isMultiline) {
    inputStyles = { ...inputStyles, ...styles.isMultiline };
  }

  if (props.isInvalid) {
    inputStyles = { ...inputStyles, ...styles.isInvalidInput };
  }

  return (
    <View
      style={[
        styles.inputContainer,
        props.style,
        {
          marginBottom: props.isInvalid
            ? verticalScale(3)
            : verticalScale(SIZES.base - 6),
        },
      ]}
    >
      {props.label && (
        <Text style={[styles.label, props.isInvalid && styles.isInvalidLabel]}>
          {props.label}
        </Text>
      )}
      <View
        style={[
          styles.textInputContainer,
          props.isInvalid && styles.isInvalidInput,
          props.icon
            ? {
                justifyContent: "center",
                paddingLeft: horizontalScale(SIZES.base - 3),
              }
            : {},
        ]}
      >
        <View style={styles.inputIcon}>{props.icon && props.icon}</View>
        <TextInput
          style={[inputStyles]}
          placeholder={props.placeholder}
          placeholderTextColor={defaultTheme.INPUT_PLACEHOLDER_TEXT_COLOR}
          autoCapitalize="none"
          editable={props.isEditable}
          multiline={props.isMultiline}
          onChangeText={props.onChangeText}
          value={props.text}
          secureTextEntry={props.secureTextEntry}
          {...props.inputConfig}
          keyboardAppearance="dark"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {},
  textInputContainer: {
    backgroundColor: defaultTheme.FORM_BACKGROUND_COLOR,
    borderBottomColor: "#000000",
    borderRadius: moderateScale(SIZES.base / 2),
    alignContent: "center",
    flexDirection: "row",
    height: moderateScale(53),
  },
  label: {
    color: defaultTheme.MUTED_TEXT_COLOR,
    fontSize: moderateScale(SIZES.base - 1),
    marginBottom: verticalScale(SIZES.base - 6),
  },
  isInvalidLabel: {
    color: defaultTheme.DANGER_COLOR,
  },
  inputIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    paddingLeft: horizontalScale(SIZES.base - 3),
    fontSize: verticalScale(SIZES.base),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    flex: 1,
    flexGrow: 1,
  },
  isInvalidInput: {
    //backgroundColor: "#FFDCDC",
    borderColor: defaultTheme.DANGER_COLOR,
  },
  isMultiline: {
    minHeight: verticalScale(100),
    textAlignVertical: "top",
  },
});
