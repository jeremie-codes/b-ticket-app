import React from "react";
import { StyleSheet, View } from "react-native";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";

export const NoMoreResult: React.FC<{ feedbackText?: string }> = ({
  feedbackText = "Plus aucun résultat.",
}) => {
  return (
    <View style={styles.container}>
      <AppTextBody>{feedbackText}</AppTextBody>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
