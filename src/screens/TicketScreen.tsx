import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useContext, useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { AppLink, AppSeparator } from "src/components";
import AppWrapper from "src/components/AppWrapper";
import { ShowEventImage } from "src/components/events/ShowEventImage";
import { SectionShowEvent } from "src/components/events/SectionShowEvent";
import { AppIcon } from "src/components/ui/icons";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { SIZES } from "src/constants/App";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { useLoadImage } from "src/hooks/useLoadImage";
import { useLoadNormalImage } from "src/hooks/useLoadNormalImage";
import { Ticket } from "src/services/ticketService";
import { defaultTheme } from "src/themes";
import { TicketScreenProps } from "src/types/navigator";
import { TicketType } from "src/types/tickets";
import { formatDateFr } from "src/utils/Date";
import { formatTimeWithoutMinutes } from "src/utils/Time";

export const TicketScreen: React.FC<TicketScreenProps> = ({
  navigation,
  route,
}: TicketScreenProps) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "Détail du billet",
      headerStyle: {
        backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
      },
      headerTitleAlign: "center",
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

  const { ticketId } = route.params;

  const { dispatch, state } = useContext(AuthContext);
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const queryKey = ["tickets", ticketId];

  const { isFetching, isLoading, data, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      toggleLoading(true);
      return Ticket.one(ticketId, true);
    },
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    onSettled(data) {
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
      toggleLoading(false);
    },
  });

  const ticket: TicketType = data?.data || {};
  const event = ticket.event || {};
  const { user } = state;
  const { filePath } = useLoadImage(event!, 600);
  const { filePath: thumbnailImage } = useLoadImage(event!, 100);
  const { filePath: qrCodeFilePath } = useLoadNormalImage(
    ticket.qrcode!,
    moderateScale(400),
    true
  );

  useEffect(() => {
    if (data?.success) {
      toggleLoading(!filePath);
    }
  }, [isLoading, filePath, data?.success]);

  const handleEventPress = () => {
    navigation.navigate("Event", {
      eventId: event.id,
    });
  };

  return (
    <AppWrapper>
      {!isFetching && !isLoading && !data?.success && (
        <FallbackFetchError message={data?.message} onPress={refetch} />
      )}
      {!isLoading && filePath && data?.success && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View style={styles.customWrapper}>
            <ShowEventImage
              fileNameUrl={filePath}
              thumbnailSource={thumbnailImage!}
            />
            <View style={styles.titleContainer}>
              <SectionShowEvent title={`ÉVÉNEMENT`}>
                <AppLink
                  onPress={handleEventPress}
                  textStyle={styles.headingText}
                  numberOfLines={3}
                >
                  {event.title}
                </AppLink>
              </SectionShowEvent>
            </View>
            <View style={styles.metaContainer}>
              <View style={styles.authorContainer}>
                <SectionShowEvent title="DATE">
                  <AppTextBody style={styles.bodyText} numberOfLines={1}>
                    {formatDateFr(event.date)}
                    {` à ${formatTimeWithoutMinutes(event.time_start)}`}
                  </AppTextBody>
                </SectionShowEvent>
              </View>
              <View style={styles.authorContainer}>
                <SectionShowEvent title="LOCALISATION">
                  <AppTextBody style={styles.bodyText} numberOfLines={1}>
                    {event.location}
                  </AppTextBody>
                </SectionShowEvent>
              </View>
            </View>
            <View style={styles.metaContainer}>
              <View style={styles.authorContainer}>
                <SectionShowEvent title="PROPRIÉTAIRE">
                  <AppTextBody style={styles.bodyText} numberOfLines={1}>
                    {user?.profile?.first_name && user?.profile?.last_name
                      ? `${user?.profile?.first_name} ${user?.profile?.last_name}`
                      : user?.name}
                  </AppTextBody>
                </SectionShowEvent>
              </View>
              <View style={[styles.authorContainer]}>
                <SectionShowEvent title="STATUT">
                  {ticket.used_at && (
                    <View style={styles.statusContainer}>
                      <AppTextBody style={styles.bodyText} numberOfLines={1}>
                        Utilisé
                      </AppTextBody>
                      <AppIcon
                        type="ionicons"
                        name="close-circle"
                        size={moderateScale(16)}
                        color={defaultTheme.DANGER_COLOR}
                      />
                    </View>
                  )}
                  {!ticket.used_at && (
                    <View style={styles.statusContainer}>
                      <AppTextBody style={styles.bodyText} numberOfLines={1}>
                        Non utilisé
                      </AppTextBody>
                      <AppIcon
                        type="material"
                        name="verified"
                        size={moderateScale(16)}
                        color={defaultTheme.SUCCESS_COLOR}
                      />
                    </View>
                  )}
                </SectionShowEvent>
              </View>
            </View>
            {ticket.qrcode && (
              <Fragment>
                <AppSeparator cost={15} />
                <View style={styles.barcodeContainer}>
                  <SectionShowEvent title="CODE QR">
                    <View style={{ marginTop: verticalScale(10) }}>
                      <Image
                        source={{
                          uri: qrCodeFilePath,
                        }}
                        style={styles.barcodeImage}
                      />
                    </View>
                  </SectionShowEvent>
                </View>
              </Fragment>
            )}
          </View>
        </ScrollView>
      )}
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    // position: "absolute",
    paddingBottom: verticalScale(10),
  },
  customWrapper: {
    flex: 1,
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
  },
  titleContainer: {
    marginTop: verticalScale(20),
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  authorContainer: {
    flex: 1,
  },
  barcodeContainer: {
    paddingTop: verticalScale(10),
  },
  statusContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: moderateScale(5),
  },
  headingText: {
    fontSize: moderateScale(SIZES.h2),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontFamily: "Epilogue_700Bold",
    lineHeight: moderateScale(30),
  },
  bodyText: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontSize: moderateScale(15),
    fontWeight: "900",
  },
  barcodeImage: {
    height: horizontalScale(350),
    width: "100%",
  },
});
