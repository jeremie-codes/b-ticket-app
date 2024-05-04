import React from "react";
import { StyleSheet, View } from "react-native";
import AppWrapper from "src/components/AppWrapper";
import { SectionShowEvent } from "src/components/events/SectionShowEvent";
import { AppButton } from "src/components/ui/buttons";
import { AppIcon } from "src/components/ui/icons";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { SIZES } from "src/constants/App";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { PaymentSuccessScreenProps } from "src/types/navigator";
import { displayedAmount } from "src/utils/Currency";
import * as Linking from "expo-linking";
import { AppNotification } from "src/utils";
import { formatDateFr } from "src/utils/Date";
import { TicketType } from "src/types/tickets";

const PaymentSuccess: React.FC<PaymentSuccessScreenProps> = ({
  navigation,
  route,
}: PaymentSuccessScreenProps) => {
  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        return;
      }),
    [navigation]
  );

  /* const queryKey = ["tickets"];
  const queryClient = useQueryClient(); */
  const { event, price, quantity, data, type } = route.params;
  const ticket =
    type === "Mobile Money"
      ? (data.data as TicketType)
      : (data?.data.original.data as TicketType);

  const handleHomePress = () => {
    navigation.navigate("Home");
  };

  const handleTicketPress = () => {
    navigation.navigate("Ticket", {
      ticketId: ticket.id,
    });
  };

  const openLinkInBrowser = async () => {
    const supported = await Linking.canOpenURL(data?.redirect?.url);
    if (supported) {
      await Linking.openURL(data?.redirect?.url);
    } else {
      AppNotification.simple(
        "Impossible l'URL pour l'instant, veuillez réessayer plus tard s'il vous plait."
      );
    }
  };

  /*   useEffect(() => {
    queryClient.invalidateQueries({ queryKey: queryKey });
  }, []);
 */
  return (
    <AppWrapper>
      <View style={styles.pageContainer}>
        <View>
          <AppTextLeading>Merci !</AppTextLeading>
        </View>
        <View>
          <SectionShowEvent
            title={
              type === "Mobile Money"
                ? "FINALISER VOTRE RÉSERVATION POUR : "
                : "CLIQUEZ SUR LE BOUTON PAYER POUR FINALISER VOTRE TRANSACTION :"
            }
          >
            <View style={{ marginVertical: verticalScale(10) }}>
              <AppTextLeading numberOfLines={3} style={styles.eventTitle}>
                {event.title}
              </AppTextLeading>
            </View>
            <View style={styles.eventMetadataContainer}>
              <View style={styles.metadatItemContainer}>
                <AppIcon
                  type="ionicons"
                  name="calendar-outline"
                  size={moderateScale(20)}
                  color={defaultTheme.PRIMARY_TEXT_COLOR}
                />
                <AppTextBody style={styles.eventMetadataText}>
                  {formatDateFr(event.date)}
                </AppTextBody>
              </View>
              <View style={styles.metadatItemContainer}>
                <AppIcon
                  type="ionicons"
                  name="location-outline"
                  size={moderateScale(20)}
                  color={defaultTheme.PRIMARY_TEXT_COLOR}
                />
                <AppTextBody style={styles.eventMetadataText}>
                  {event.location.toUpperCase()}
                </AppTextBody>
              </View>
              <View style={styles.metadatItemContainer}>
                <AppIcon
                  type="materialCommunityIcons"
                  name="ticket-confirmation-outline"
                  size={moderateScale(20)}
                  color={defaultTheme.PRIMARY_TEXT_COLOR}
                />

                <AppTextBody style={styles.eventMetadataText}>
                  <React.Fragment>
                    {displayedAmount(
                      price?.amount!,
                      price?.currency?.toUpperCase()
                    )}
                    {" X " + quantity}
                  </React.Fragment>
                </AppTextBody>
              </View>
            </View>
            <View style={styles.btnContainer}>
              {type === "Carte Bancaire" && (
                <View>
                  <AppButton onPress={openLinkInBrowser}>
                    PAYER VIA LE NAVIGATEUR
                  </AppButton>
                </View>
              )}
              <View>
                <AppButton onPress={handleTicketPress}>
                  VOIR LE BILLET
                </AppButton>
              </View>
              <View>
                <AppButton onPress={handleHomePress} noBackground>
                  RENTRER À L'ACCUEIL
                </AppButton>
              </View>
            </View>
          </SectionShowEvent>
        </View>
      </View>
    </AppWrapper>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  eventMetadataContainer: {
    gap: moderateScale(8),
    marginBottom: verticalScale(30),
    marginTop: verticalScale(10),
  },
  metadatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  eventAuthorContainer: {
    marginVertical: verticalScale(2),
  },
  authorName: {
    fontSize: moderateScale(SIZES.base - 2),
    fontWeight: "700",
  },
  eventMetadataText: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontSize: moderateScale(SIZES.base),
    fontWeight: "700",
  },
  btnContainer: {
    gap: moderateScale(20),
  },
  eventTitle: {
    fontSize: moderateScale(SIZES.h3),
    lineHeight: moderateScale(25),
  },
});
