import { StyleSheet } from "react-native";
import { ClickableWrapper } from "src/components/ClickableWrapper";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { EventPricingType } from "src/types/event";
import { displayedAmount } from "src/utils/Currency";

type PriceType = {
  price: EventPricingType;
  active?: boolean;
  onPress: () => void;
};

const Prices: React.FC<PriceType> = ({ price, active, onPress }) => {
  const containerStyle = [
    styles.priceItemContainer,
    {
      backgroundColor: active
        ? defaultTheme.SECONDARY_BACKGROUND_COLOR
        : defaultTheme.PRIMARY_BACKGROUND_COLOR,
    },
  ];

  const textStyle = [
    styles.priceText,
    {
      color: active
        ? defaultTheme.PRIMARY_TEXT_COLOR
        : defaultTheme.BODY_TEXT_COLOR,
    },
  ];

  const borderColorStyle = [
    {
      borderColor: active
        ? defaultTheme.SECONDARY_BACKGROUND_COLOR
        : defaultTheme.BODY_TEXT_COLOR,
    },
  ];

  return (
    <ClickableWrapper
      onPress={onPress}
      style={[containerStyle, borderColorStyle]}
    >
      {price.amount && (
        <AppTextBody style={textStyle}>
          {displayedAmount(price.amount, price.currency?.toUpperCase())}
        </AppTextBody>
      )}

      <AppTextBody style={textStyle}>
        {price.category.toUpperCase()}
      </AppTextBody>
    </ClickableWrapper>
  );
};

const styles = StyleSheet.create({
  priceItemContainer: {
    borderWidth: moderateScale(1),
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(16),
    borderRadius: verticalScale(5),
  },
  priceText: {
    fontSize: moderateScale(12),
  },
});
export default Prices;
