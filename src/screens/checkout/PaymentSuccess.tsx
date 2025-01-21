import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
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
import { WebView } from 'react-native-webview';

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
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [successPaied, setSuccessPaied] = useState(false);
  const [annuler, setAnnuler] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const webViewRef = useRef(null);

  const ticket =
    type === "Mobile Money"
      ? (data.data as TicketType)
      : (data?.data as TicketType);

  const handleHomePress = () => {
    navigation.navigate("Home");
  };

  const handleTicketPress = () => {
    navigation.navigate("Ticket", {
      ticketId: ticket.id,
    });
  };

  useEffect(() => {
    if (type === "Carte Bancaire" && !successPaied && !annuler) setWebViewVisible(true);
  })

  const openLinkInBrowser = async () => {
    // console.log(data)
    if (type === "Carte Bancaire" && !successPaied) {
      setWebViewVisible(true);
      setAnnuler(false);
    }
    // const formPay = {
    //   montant: price?.amount,
    //   currency: 'usd',
    //   event_id: event.id,
    //   type: 'card',
    //   quantity,
    //   total: quantity * parseFloat(price?.amount),
    // }
    // const supported = await Linking.canOpenURL(data?.redirect?.url);
    // if (supported) {
    //   await Linking.openURL(data?.redirect?.url);
    // } else {
    //   AppNotification.simple(
    //     "Impossible l'URL pour l'instant, veuillez réessayer plus tard s'il vous plait."
    //   );
    // }
  };

  const handleNavigationStateChange = (navState: any) => {
    const newUrl = navState.url;  // L'URL actuelle
    setCurrentUrl(newUrl);  // Mettre à jour l'URL actuelle

    // Vérifier si l'URL a changé par rapport à l'URL initiale
    if (newUrl !== data.data) {
      setWebViewVisible(false)
      setAnnuler(false);
      setSuccessPaied(true)
      AppNotification.simple("Opération réussie", "success", "Votre paiement a été effectuée avec succès.");
    } 
  };

  return (
    <AppWrapper>
      {!isWebViewVisible && <View style={styles.pageContainer}>
        <View>
          <AppTextLeading>Merci !</AppTextLeading>
        </View>
        <View>
          <SectionShowEvent
            title={
              type === "Mobile Money"
                ? "FINALISER VOTRE RÉSERVATION POUR : "
                : successPaied ? "D'AVOIR VALIDÉ VOTRE RESERVATION DE BILLET POUR :" : "CLIQUEZ SUR LE BOUTON PAYER POUR FINALISER VOTRE TRANSACTION :"
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
              {type === "Carte Bancaire" && !successPaied && (
                <View>
                  <AppButton onPress={openLinkInBrowser}>
                    PAYER VOTRE BILLET
                  </AppButton>
                </View>
              )}
              <View>
                <AppButton onPress={() => navigation.navigate('Tickets')}>
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
      </View>}

      {isWebViewVisible && (
        <View style={{ flex: 1 }} >

          <WebView
            source={{ uri: data.data }}
            ref={webViewRef}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => {
              console.log(data.data);
            }}
            onLoadEnd={() => {
              console.log('Chargement terminé');
            }}
            onError={(error) => {
              console.log('Erreur WebView', error);
            }}
          />

          {/* <Pressable style={{ padding: 15, backgroundColor: 'orange', position: 'absolute', top: 0, width: '100%' }} onPress={() => setWebViewVisible(false)}> */}
          <Pressable style={{ padding: 15, backgroundColor: 'orange', width: '100%' }} onPress={() => {
            setWebViewVisible(false)
            setAnnuler(true)
          }}>
            <Text style={{ textAlign: 'center' }}>Annuler</Text>
          </Pressable>
       </View>
      )}
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
