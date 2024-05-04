import { SIZES } from "src/constants/App";
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) =>
  (SIZES.width / guidelineBaseWidth) * size;
const verticalScale = (size: number) =>
  (SIZES.height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };
