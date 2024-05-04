import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import React, { useState } from "react";
import { EventPricingType, EventType } from "src/types/event";
import { SIZES } from "src/constants/App";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { AppLink } from "src/components";
import { defaultTheme } from "src/themes";
import { AppButton } from "src/components/ui/buttons";
import { SectionShowEvent } from "src/components/events/SectionShowEvent";
import { displayedAmount } from "src/utils/Currency";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type IProps = {
  price?: EventPricingType;
  event: EventType;
  bottomSheetModalRef: any;
  handleClosePress: () => void;
  onCheckoutPress: (
    event: EventType,
    price: EventPricingType,
    quantity: number
  ) => void;
};
export const ConfirmModal: React.FC<IProps> = ({
  event,
  price,
  bottomSheetModalRef,
  onCheckoutPress,
  handleClosePress,
}) => {
  const [quantity, setQuantity] = useState(1);

  // Function to handle the increment action
  const incrementQuantity = () => {
    if (quantity === 99) return;
    setQuantity(quantity + 1);
  };

  // Function to handle the decrement action
  const decrementQuantity = () => {
    if (quantity === 1) return;
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleCheckoutPress = () => {
    if (price) {
      handleClosePress();
      onCheckoutPress(event, price, quantity);
    }
  };

  const snapPoints = ["48%"];

  return (
    <BottomSheetModal
      containerStyle={styles.sheetContainer}
      index={0}
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      backgroundStyle={styles.backgroundStyle}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <AppTextLeading style={styles.title}>
            Combien de billets ?
          </AppTextLeading>
        </View>
        <View style={styles.detailContent}>
          <SectionShowEvent title="ÉVÉNEMENT">
            <AppTextLeading numberOfLines={3} style={styles.eventTitle}>
              {event.title}
            </AppTextLeading>
          </SectionShowEvent>
          <View style={styles.qtyContainer}>
            {price?.amount && (
              <SectionShowEvent title="CATÉGORIE">
                <AppTextBody style={styles.category}>
                  {price?.category.toUpperCase() + " : "}
                  {displayedAmount(
                    parseFloat(price.amount) * quantity,
                    price.currency?.toLocaleUpperCase()
                  )}
                </AppTextBody>
              </SectionShowEvent>
            )}

            <View style={styles.qtyFilter}>
              <TouchableOpacity
                style={styles.decrementContainer}
                onPress={decrementQuantity}
              >
                <Text style={styles.decrementText}>-</Text>
              </TouchableOpacity>
              <View style={styles.textInputContainer}>
                <TextInput
                  value={quantity.toString()}
                  editable={false}
                  onChangeText={(text) => setQuantity(parseInt(text) || 1)}
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>
              <TouchableOpacity
                style={styles.incrementContainer}
                onPress={incrementQuantity}
              >
                <Text style={styles.incrementText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View>
              <AppButton onPress={handleCheckoutPress}>Enregistrer</AppButton>
            </View>
            <View style={[styles.cancelButton]}>
              <AppLink
                onPress={handleClosePress}
                textStyle={{
                  color: defaultTheme.SECONDARY_BUTTON_TEXT_COLOR,
                }}
              >
                Annuler
              </AppLink>
            </View>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: defaultTheme.FORM_BACKGROUND_COLOR,
  },
  sheetContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(SIZES.base + 4),
    paddingBottom: verticalScale(SIZES.h1),
    height: horizontalScale(SIZES.height * 0.44),
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(18),
  },
  detailContent: {
    justifyContent: "flex-end",
  },
  eventTitle: {
    fontSize: moderateScale(SIZES.h3),
    lineHeight: moderateScale(30),
  },
  buttonContainer: {
    marginTop: verticalScale(16),
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(SIZES.base + 10),
  },
  category: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  qtyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  qtyFilter: {
    flexDirection: "row",
    gap: moderateScale(10),
    backgroundColor: defaultTheme.PRIMARY_TEXT_COLOR,
    //paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(SIZES.base * 2),
  },
  textInputContainer: {
    width: verticalScale(30),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  incrementContainer: {
    paddingRight: verticalScale(SIZES.base),
  },
  incrementText: {
    fontSize: moderateScale(20),
  },
  decrementContainer: {
    paddingLeft: verticalScale(SIZES.base),
  },
  decrementText: {
    fontSize: moderateScale(20),
  },
  textInput: {
    fontSize: moderateScale(14),
  },
});
