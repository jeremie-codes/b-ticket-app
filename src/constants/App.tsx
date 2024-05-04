import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("screen");

export const SIZES = {
  height,
  width,

  base: 16,
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  h5: 14,
  h6: 12,

  large: 60,

  opacity: 0.75,
  elevation: 2,
};
