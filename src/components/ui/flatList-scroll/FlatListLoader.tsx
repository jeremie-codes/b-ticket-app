import { ActivityIndicator, StyleSheet, View } from "react-native";

export const FlatListLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
