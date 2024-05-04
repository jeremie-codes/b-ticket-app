import { StyleSheet, View } from "react-native";
import { AppTextBody } from "../texts/AppTextBody";
import { AppLink } from "src/components/AppLink";
import React from "react";

type IProps = {
  message?: string;
  onPress: () => void;
};
const FallbackFetchError: React.FC<IProps> = ({ message, onPress }) => {
  return (
    <React.Fragment>
      {message && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppTextBody style={{ textAlign: "center" }}>{message}</AppTextBody>
          <AppLink onPress={onPress}>Réessayer ?</AppLink>
        </View>
      )}
    </React.Fragment>
  );
};

export default FallbackFetchError;

const styles = StyleSheet.create({});
