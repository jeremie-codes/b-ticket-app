import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { AppSeparator, HeaderTitle } from "src/components";
import AppWrapper from "src/components/AppWrapper";
import { ClickableWrapper } from "src/components/ClickableWrapper";
import { createServerErrorArray } from "src/components/events/ExtractFormErrorsFromResponse";
import { SectionShowEvent } from "src/components/events/SectionShowEvent";
import { AppInputController } from "src/components/form";
import { ServerErrorType } from "src/components/form/helpers/InputCheckError";
import { AppButton } from "src/components/ui/buttons";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { SIZES } from "src/constants/App";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { Ticket } from "src/services/ticketService";
import { defaultTheme } from "src/themes";
import { CheckoutScreenProps } from "src/types/navigator";
import { apiAmount, displayedAmount } from "src/utils/Currency";

type PaymentMethodType = "Carte Bancaire" | "Mobile Money";
type PaymentMethodItemType = {
  item: PaymentMethodType;
  isActive: boolean;
};
const PaymentMethodItem: React.FC<PaymentMethodItemType> = ({
  item,
  isActive,
}) => {
  const activeBgStyle = {
    backgroundColor: defaultTheme.SECONDARY_BACKGROUND_COLOR,
  };
  return (
    <View style={[styles.radioWrapper]}>
      <View style={styles.radioContainer}>
        <View style={[styles.radioContent, isActive && activeBgStyle]} />
      </View>
      <View>
        <AppTextBody>{item}</AppTextBody>
      </View>
    </View>
  );
};

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  navigation,
  route,
}: CheckoutScreenProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
      headerStyle: {
        backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
      },
      headerLeftContainerStyle: {
        paddingLeft: horizontalScale(11),
      },
      headerBackTitleVisible: false,
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "right",
      },
    });
  }, [navigation]);

  const [serverErrors, setServerErrors] = useState<ServerErrorType>();
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const { dispatch } = useContext(AuthContext);

  const { state } = useContext(AuthContext);
  const { user } = state;
  const { event, price, quantity } = route.params;
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("Mobile Money");
  const queryClient = useQueryClient();
  const queryKey = ["tickets"];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
  });

  const onHandleSubmit = async (data: any) => {
    await onPay(data);
  };

  const { mutateAsync: onPay } = useMutation({
    mutationFn: async (data: any) =>
      await Ticket.payTicket(
        {
          type: paymentMethod === "Carte Bancaire" ? "card" : "mobile",
          phone: data.phone,
          amount: apiAmount(parseFloat(price?.amount!) * quantity),
          currency: price?.currency?.toUpperCase(),
          event_id: event.id,
          quantity: quantity,
        },
        true
      ),
    onMutate: () => {
      setServerErrors(undefined);
      toggleLoading(true);
    },
    onSettled: (data) => {
      if (data && data.success) {
        toggleLoading(false);
        handlePaymentSuccessPress(data);
        queryClient.invalidateQueries({ queryKey: queryKey });
        return;
      }
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (!data.success && data.errors) {
        setServerErrors(createServerErrorArray(data.errors));
        toggleLoading(false);
        return;
      }
    },
  });

  const handleProfilePress = () => {
    navigation.navigate("Account");
  };

  const handleChangePaymentMethod = (method: PaymentMethodType) => {
    setPaymentMethod(method);
  };

  const handlePaymentSuccessPress = (data: object) => {
    navigation.navigate("PaymentSuccess", {
      event: event,
      quantity: quantity,
      type: paymentMethod,
      price: price,
      data: data,
    });
  };

  useEffect(() => {
    toggleLoading(isSubmitting);
  }, [isSubmitting]);

  return (
    <AppWrapper>
      <Pressable onPress={Keyboard.dismiss}>
        <HeaderTitle>Checkout</HeaderTitle>

        <View>
          <SectionShowEvent
            title="COORDONNÉES"
            actionTitle="Modifier"
            actionOnClick={handleProfilePress}
            selfStyle={styles.contact}
            style={{ marginTop: verticalScale(30) }}
          >
            <View>
              <AppTextBody numberOfLines={1}>
                {user?.profile?.first_name && user?.profile?.last_name
                  ? `${user?.profile?.first_name} ${user?.profile?.last_name}`
                  : user?.name}
              </AppTextBody>
              <AppTextBody numberOfLines={1} style={styles.textWhite}>
                {user?.email}
              </AppTextBody>
            </View>
          </SectionShowEvent>

          <SectionShowEvent selfStyle={styles.contact} title="ÉVÉNEMENT">
            <View>
              <AppTextBody numberOfLines={2} style={[styles.textWhite]}>
                {event.title}
              </AppTextBody>
            </View>
          </SectionShowEvent>
          <AppSeparator cost={15} />

          <SectionShowEvent
            selfStyle={styles.contact}
            title="MODES DE PAIEMENT"
          >
            <View style={styles.paymentMethodContainer}>
              <ClickableWrapper
                onPress={handleChangePaymentMethod.bind(this, "Mobile Money")}
              >
                <PaymentMethodItem
                  item="Mobile Money"
                  isActive={paymentMethod === "Mobile Money"}
                />
              </ClickableWrapper>
              <ClickableWrapper
                onPress={handleChangePaymentMethod.bind(this, "Carte Bancaire")}
              >
                <PaymentMethodItem
                  item="Carte Bancaire"
                  isActive={paymentMethod === "Carte Bancaire"}
                />
              </ClickableWrapper>
            </View>
            {paymentMethod === "Mobile Money" && (
              <View style={styles.phoneContainer}>
                <AppInputController
                  serverErrors={serverErrors}
                  errors={errors}
                  control={control}
                  name="phone"
                  placeholder="243000000000"
                  //defaultValue={defaultValues[field.name] || field.defaultValue}
                  rules={{
                    required: {
                      value: true,
                      message: "Le numéro de téléphone est obligatoire",
                    },
                    maxLength: {
                      value: 15,
                      message:
                        "Le champ téléphone ne doit pas contenir plus de 15 caractères",
                    },
                  }}
                  // invalid={field.invalid}
                  label="Votre numéro de téléphone"
                  keyboardType="phone-pad"
                />
              </View>
            )}
          </SectionShowEvent>

          <AppSeparator cost={10} />

          <SectionShowEvent
            selfStyle={styles.contact}
            title="DÉTAIL DU PAIEMENT"
          >
            <View style={styles.detailContainerWrapper}>
              <View style={styles.detailContainer}>
                <AppTextBody style={styles.detailLeftText}>
                  Prix du billet
                </AppTextBody>
                <AppTextBody style={styles.detailRightText}>
                  {displayedAmount(price?.amount!, price?.currency)}
                </AppTextBody>
              </View>
              <View style={styles.detailContainer}>
                <AppTextBody style={styles.detailLeftText}>
                  Quantité
                </AppTextBody>
                <AppTextBody style={styles.detailRightText}>
                  {quantity}
                </AppTextBody>
              </View>
              <View style={styles.detailContainer}>
                <AppTextBody style={styles.detailLeftText}>Taxe</AppTextBody>
                <AppTextBody style={styles.detailRightText}>
                  0,00 USD
                </AppTextBody>
              </View>
              <View style={styles.detailContainer}>
                <AppTextBody style={styles.detailLeftText}>
                  Total à payer
                </AppTextBody>
                <AppTextBody style={styles.detailRightText}>
                  {displayedAmount(
                    parseFloat(price?.amount!) * quantity,
                    price?.currency
                  )}
                </AppTextBody>
              </View>
            </View>
          </SectionShowEvent>

          <View>
            <AppButton onPress={handleSubmit(onHandleSubmit)}>
              Réserver
            </AppButton>
          </View>
        </View>
      </Pressable>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  contact: {
    marginTop: verticalScale(5),
  },
  textWhite: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  detailContainerWrapper: {},

  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  detailLeftText: {},
  detailRightText: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: moderateScale(SIZES.h3),
    lineHeight: moderateScale(25),
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: moderateScale(7),
  },
  radioContainer: {
    width: verticalScale(30),
    height: horizontalScale(30),
    borderWidth: 2,
    borderColor: defaultTheme.SEPARATOR_COLOR,
    borderRadius: moderateScale(15),
    justifyContent: "center", // Add this line
    alignItems: "center", // Add this line
  },
  radioContent: {
    width: verticalScale(22),
    height: horizontalScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
  },
  phoneContainer: {
    marginTop: verticalScale(15),
  },
});
