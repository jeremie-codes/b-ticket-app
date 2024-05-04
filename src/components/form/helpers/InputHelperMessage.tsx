import { View, StyleSheet } from "react-native";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";

type InputMessageType = {
  message?: string;
  type?: "default" | "success" | "error" | "warning";
};

type RenderMessageType = {
  message: string;
};

const RenderDefaultMessage: React.FC<RenderMessageType> = ({
  message,
}: RenderMessageType) => {
  return (
    <View style={styles.messageContainer}>
      <AppTextBody style={styles.messageText}>{message}</AppTextBody>
    </View>
  );
};

const RenderErrorMessage: React.FC<RenderMessageType> = ({
  message,
}: RenderMessageType) => {
  return (
    <View style={styles.messageContainer}>
      <AppTextBody style={[styles.errorColor, styles.messageText]}>
        {message}
      </AppTextBody>
    </View>
  );
};

const RenderSuccessMessage: React.FC<RenderMessageType> = ({
  message,
}: RenderMessageType) => {
  return (
    <View style={styles.messageContainer}>
      <AppTextBody style={[styles.successColor, styles.messageText]}>
        {message}
      </AppTextBody>
    </View>
  );
};

export const InputHelperMessage: React.FC<InputMessageType> = (
  props: InputMessageType
) => {
  const { message, type = "default" } = props;

  if (type === "error" && message)
    return <RenderErrorMessage message={message} />;
  if (type === "success" && message)
    return <RenderSuccessMessage message={message} />;
  return <RenderDefaultMessage message={message ? message : "Champ invalid"} />;
};

const styles = StyleSheet.create({
  errorColor: {
    color: defaultTheme.DANGER_COLOR,
  },
  successColor: {
    color: defaultTheme.SUCCESS_COLOR,
  },
  messageContainer: {
    marginBottom: verticalScale(9),
  },
  messageText: {
    fontSize: moderateScale(14),
  },
});
