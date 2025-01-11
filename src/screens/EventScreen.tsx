import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SIZES } from "src/constants/App";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { Event } from "src/services/eventService";
import { defaultTheme } from "src/themes";
import { useLoadImage } from "src/hooks/useLoadImage";
import { EventPricingType, EventType } from "src/types/event";
import AppWrapper from "src/components/AppWrapper";
import { EventScreenProps } from "src/types/navigator";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppIcon } from "src/components/ui/icons";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { AppSeparator } from "src/components";
import { SectionShowEvent } from "src/components/events/SectionShowEvent";
import Prices from "src/components/events/Prices";
import { displayedAmount } from "src/utils/Currency";
import { AppButton } from "src/components/ui/buttons";
import { ConfirmModal } from "./checkout/ConfirmModal";
import { formatDateFr } from "src/utils/Date";
import { ShowEventImage } from "src/components/events/ShowEventImage";
import { formatTimeRange } from "src/utils/Time";
import { FavoriteIcon } from "src/components/events/FavoriteIcon";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ProgressiveImage } from "src/components/ui/image/ProgressiveImage";

export const EventScreen = ({ navigation, route }: EventScreenProps) => {
  const { eventId } = route.params;
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const { dispatch } = useContext(AuthContext);
  const [activePrice, setActivePrice] = useState<EventPricingType | undefined>(
    undefined
  );

  const { isLoading, isFetching, data, refetch } = useQuery({
    queryKey: ["events", "event", eventId],
    queryFn: () => {
      toggleLoading(true);
      return Event.getOne(eventId, true);
    },
    staleTime: 60_000,
    onSettled(data) {
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      toggleLoading(false);
    },
  });


  const event: EventType = data?.data || {};

  const { filePath } = useLoadImage(event!, 600);
  const { filePath: filePathThumbnail } = useLoadImage(event!, 50);
  const { filePath: authImage } = useLoadImage(event!, 200, 0);

  React.useLayoutEffect(() => {

    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "Détails de l'événement",
      headerStyle: {
        backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
      },
      headerLeftContainerStyle: {
        paddingLeft: horizontalScale(11),
      },
      headerBackTitleVisible: false,
      headerTitleAlign: "center",
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "right",
      },

      headerRight: () => <FavoriteIcon event={event} />,
    });

  }, [navigation, event]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const handlePresentModal = () => {
    setModalIsOpen(true);
    // console.log(bottomSheetModalRef.current)
    bottomSheetModalRef.current?.present();
  };

  const handleClosePress = () => {
    setModalIsOpen(false);
    bottomSheetModalRef.current?.close();
  };

  const handleChangeActivatedPrice = (price: EventPricingType) => {
    if (price?.id === activePrice?.id) {
      return;
    }
    setActivePrice(price);
  };

  useEffect(() => {
    if (data?.success) {
      const event: EventType = data?.data;
      setActivePrice(event?.prices[0]);
    }
  }, [isLoading, data?.success]);

  const handleCheckoutPress = (
    event: EventType,
    price: EventPricingType,
    quantity: number
  ) => {
    navigation.navigate("Checkout", {
      event: event,
      price: price,
      quantity: quantity,
    });
  };

  const handleCloseModalIfIsOpen = () => {
    if (modalIsOpen) {
      handleClosePress();
    }
  };

  return (
    <AppWrapper>
      {!isFetching && !isLoading && !data?.success && (
        <FallbackFetchError message={data?.message} onPress={refetch} />
      )}
      {!isLoading && data?.success && (
        <React.Fragment>
            <ConfirmModal
              handleClosePress={handleClosePress}
              bottomSheetModalRef={bottomSheetModalRef}
              price={activePrice}
              event={event}
              onCheckoutPress={handleCheckoutPress}
              />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
          >
            <Pressable onPress={handleCloseModalIfIsOpen}>
              <View style={styles.customWrapper}>
                <ShowEventImage
                  fileNameUrl={filePath!}
                  thumbnailSource={filePathThumbnail!}
                />

                <AppTextLeading style={styles.eventTitle}>
                  {event.title}
                </AppTextLeading> 
                <View style={styles.metadatItemContainer}>
                  <AppIcon
                    type="ionicons"
                    name="calendar-outline"
                    size={moderateScale(16)}
                    color={defaultTheme.BODY_TEXT_COLOR}
                  />
                  <AppTextBody style={styles.eventMetadataText}>
                    {formatDateFr(event.date)}{" "}
                    {formatTimeRange(event.time_start, event.time_end)}
                  </AppTextBody>
                </View>
                <View
                  style={[
                    styles.metadatItemContainer,
                    { paddingBottom: verticalScale(15) },
                  ]}
                >
                  <AppIcon
                    type="ionicons"
                    name="location-outline"
                    size={moderateScale(16)}
                    color={defaultTheme.BODY_TEXT_COLOR}
                  />
                  <AppTextBody style={styles.eventMetadataText}>
                    {event.location.toUpperCase()}
                  </AppTextBody>
                </View>
                <View style={styles.authorContainer}>
                  <ProgressiveImage
                    source={{
                      uri: authImage,
                    }}
                    thumbnailSource={{
                      uri: authImage,
                    }}
                    style={styles.authorAvatar}
                  />

                  <View>
                    <AppTextBody style={styles.authorName}>
                      {event.author_name} - {event.category.name}
                    </AppTextBody>
                    <AppTextBody style={styles.authorTitle}>
                      Organisateur
                    </AppTextBody>
                  </View>
                </View>
                <AppSeparator />

                {event.prices[0]?.amount && event.prices[0]?.currency && (
                  <SectionShowEvent
                    style={styles.priceSectionEvent}
                    title="PRIX"
                  >
                    <View style={styles.pricesContainer}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.pricesContainerStyle}
                      >
                        {event.prices.map((price, index) => (
                          <Prices
                            price={price}
                            active={activePrice?.id === price?.id}
                            key={index}
                            onPress={handleChangeActivatedPrice.bind(
                              this,
                              price
                            )}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  </SectionShowEvent>
                )}
                <SectionShowEvent title="DESCRIPTION">
                  <AppTextBody
                    style={{ color: defaultTheme.PRIMARY_TEXT_COLOR }}
                  >
                    {event.description}
                  </AppTextBody>
                </SectionShowEvent>

                <View style={styles.buttonWrapper}>
                  <AppButton onPress={handlePresentModal}>
                    {activePrice?.amount && activePrice?.currency && (
                      <React.Fragment>
                        {displayedAmount(
                          activePrice?.amount,
                          activePrice.currency?.toUpperCase()
                        ) + " - "}
                      </React.Fragment>
                    )}
                    Réserver
                  </AppButton>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </React.Fragment>
      )}
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  customWrapper: {
    flex: 1,
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
  },
  container: {
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    // position: "absolute",
    paddingBottom: verticalScale(10),
  },

  authorContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    alignItems: "center",
    paddingBottom: verticalScale(17),
  },
  authorAvatar: {
    width: moderateScale(40),
    height: horizontalScale(40),
    borderRadius: verticalScale(100),
  },
  authorName: {
    fontSize: moderateScale(14),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  authorTitle: {
    fontSize: moderateScale(14),
  },
  navigatorLeftButton: {
    paddingLeft: horizontalScale(SIZES.base + 4 - 10),
    position: "absolute",
    zIndex: 9999,
    left: 0,
    top: Platform.OS === "ios" ? "13%" : "8%",
  },

  eventTitle: {
    fontSize: moderateScale(SIZES.h2),
    marginTop: verticalScale(16),
  },
  metadatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    marginVertical: verticalScale(3),
  },
  eventMetadataText: {
    color: defaultTheme.BODY_TEXT_COLOR,
    fontSize: moderateScale(SIZES.base - 2),
    fontWeight: "700",
  },
  pricesContainer: {
    flexDirection: "row",
  },
  priceSectionEvent: {
    marginTop: moderateScale(13),
  },
  pricesContainerStyle: {
    marginTop: moderateScale(3),
    gap: moderateScale(10),
  },
  buttonWrapper: {
    marginVertical: verticalScale(10),
  },
});
