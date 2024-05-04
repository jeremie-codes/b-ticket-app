import { StyleSheet, View } from "react-native";
import { AppLink, HeaderTitle } from "src/components";
import AppWrapper from "src/components/AppWrapper";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { useContext, useState } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ticket } from "src/services/ticketService";
import { TicketType } from "src/types/tickets";
import { defaultTheme } from "src/themes";
import { FlatList } from "react-native-gesture-handler";
import { SIZES } from "src/constants/App";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { AppIcon } from "src/components/ui/icons";
import { ClickableWrapper } from "src/components/ClickableWrapper";
import { formatDateFr } from "src/utils/Date";
import { TicketsScreenProps } from "src/types/navigator";
import { NoMoreResult } from "src/components/ui/flatList-scroll/NoMoreResult";
import { FlatListLoader } from "src/components/ui/flatList-scroll/FlatListLoader";
import { PaginatorResponseType, ResponseType } from "src/types/response";
import { AppBadge } from "src/components/ui/badges/AppBadge";
import EmptyList from "src/components/ui/layouts/EmptyList";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";

const dotContainerWidth = SIZES.width * 0.74; // 80% of the screen width
const dotCount = Math.floor(dotContainerWidth / 6);

export type TicketStatusType = "past" | "upcoming" | null;

export const TicketsScreen: React.FC<TicketsScreenProps> = ({
  navigation,
}: TicketsScreenProps) => {
  const { dispatch } = useContext(AuthContext);
  const [activeStatus, setActiveStatus] = useState<TicketStatusType>(null);
  const [status, setStatus] = useState<TicketStatusType>(null);
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const queryKey = ["tickets", status];

  const {
    isFetching,
    isLoading,
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      toggleLoading(true);
      return Ticket.all(status, pageParam, true);
    },

    getNextPageParam: (lastPage) => {
      const paginator: PaginatorResponseType = lastPage?.data;
      return paginator?.has_more ? paginator.current_page + 1 : undefined;
    },
    keepPreviousData: true, // Keep previous data while loading new pages
    retry: false, // Disable automatic retrying on error
    onSettled(data) {
      const dataResponse: ResponseType =
        data?.pages.flatMap((page) => page)[0] || {};
      if (dataResponse.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }
      toggleLoading(false);
    },
  });

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetching) {
      return <FlatListLoader />;
    }

    if (!isLoading && !isFetchingNextPage && !hasNextPage) {
      return <NoMoreResult />;
    }

    return null;
  };

  const handleTicketPress = (ticketId: number) => {
    navigation.navigate("Ticket", {
      ticketId,
    });
  };

  const tickets: TicketType[] =
    data?.pages.flatMap((page) => page?.data?.data) || [];

  const dataResponse: ResponseType =
    data?.pages.flatMap((page) => page)[0] || {};

  const handleOnChangeStatusText = (inputText: TicketStatusType) => {
    if (inputText === activeStatus) {
      setActiveStatus(null);
      setStatus(null);
      return;
    }
    setStatus(inputText);
    setActiveStatus(inputText);
  };

  return (
    <AppWrapper>
      <HeaderTitle>Mes billets</HeaderTitle>

      {dataResponse.success && (
        <View style={styles.buttonsContainer}>
          <AppBadge
            onPress={handleOnChangeStatusText.bind(this, null)}
            fullFlex
            active={activeStatus === null}
            label="Tout voir"
          />
          <AppBadge
            onPress={handleOnChangeStatusText.bind(this, "upcoming")}
            fullFlex
            active={activeStatus === "upcoming"}
            label="À venir"
          />
          <AppBadge
            onPress={handleOnChangeStatusText.bind(this, "past")}
            fullFlex
            active={activeStatus === "past"}
            label="Passés"
          />
        </View>
      )}

      {!isFetching && !isLoading && !dataResponse.success && (
        <FallbackFetchError message={dataResponse?.message} onPress={refetch} />
      )}
      {dataResponse?.success && tickets.length < 1 && (
        <EmptyList
          title="Vous n'avez pas de billet"
          subtitle="Il n'y a actuellement aucun billet acheté."
        />
      )}

      {tickets.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gap}
          data={tickets}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <ClickableWrapper
              key={item.id}
              onPress={handleTicketPress.bind(this, item.id)}
            >
              <View style={styles.ticketContainer}>
                <View style={styles.ticketInfo}>
                  <View style={styles.ticketInfoTop}>
                    <AppTextLeading
                      numberOfLines={2}
                      style={styles.ticketInfoEventTitle}
                    >
                      {item.event.title}
                    </AppTextLeading>
                    <View style={styles.ticketInfoLocationContainer}>
                      <AppIcon
                        type="ionicons"
                        name="calendar-outline"
                        size={moderateScale(18)}
                        color={defaultTheme.BODY_TEXT_COLOR}
                      />
                      <AppTextBody style={styles.ticketInfoEventLocation}>
                        {formatDateFr(item.event.date)}
                      </AppTextBody>
                    </View>
                  </View>
                  <View style={styles.ticketInfoBottom}>
                    <AppLink textStyle={{ fontSize: moderateScale(14) }}>
                      Voir le billet
                    </AppLink>
                    <AppTextBody
                      style={{
                        fontSize: moderateScale(13),
                        color: item.success
                          ? defaultTheme.SUCCESS_COLOR
                          : item.success !== null
                          ? defaultTheme.DANGER_COLOR
                          : defaultTheme.WARNING_COLOR,
                      }}
                    >
                      paiement{" "}
                      {item.success
                        ? "réussi"
                        : item.success !== null
                        ? "échoué"
                        : "en attente"}
                    </AppTextBody>
                  </View>
                </View>
                <View
                  style={[styles.dotContainer, { width: dotContainerWidth }]}
                >
                  {Array(dotCount)
                    .fill(null)
                    .map((_, index) => (
                      <View key={index} style={styles.dot} />
                    ))}
                </View>
                <View style={[styles.circle, styles.leftCircle]} />
                <View style={[styles.circle, styles.rightCircle]} />
              </View>
            </ClickableWrapper>
          )}
        />
      )}
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  ticketInfo: {
    paddingHorizontal: horizontalScale(25),
    paddingTop: verticalScale(15),
    justifyContent: "space-between",
    flex: 1,
  },
  ticketInfoEventTitle: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(25),
  },
  ticketInfoTop: {},
  ticketInfoLocationContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginTop: verticalScale(10),
    alignItems: "center",
  },
  ticketInfoBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(15),
  },
  ticketInfoEventLocation: {
    fontSize: moderateScale(14),
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: moderateScale(16),
    marginTop: verticalScale(25),
    paddingBottom: verticalScale(15),
  },
  button: {
    flex: 1,
  },
  gap: {
    gap: moderateScale(15),
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(25),
  },
  emptyListContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  ticketContainer: {
    width: "100%",
    height: horizontalScale(180),
    borderColor: defaultTheme.FORM_BACKGROUND_COLOR,
    borderWidth: 2,
    borderRadius: 8,
  },
  ticketContent: {
    position: "absolute",
    bottom: 65,
    left: 28,
  },
  lineSeparator: {
    position: "absolute",
    width: "90%",
    bottom: 65,
    left: 28,
  },
  circle: {
    position: "absolute",
    width: verticalScale(45),
    height: horizontalScale(45),
    borderRadius: moderateScale(20),
    top: verticalScale(85),
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    borderColor: defaultTheme.FORM_BACKGROUND_COLOR,
    borderWidth: 2,
  },
  leftCircle: {
    left: verticalScale(-25),
  },
  rightCircle: {
    right: verticalScale(-25),
  },
  dotContainer: {
    position: "absolute",
    bottom: horizontalScale(65),
    left: verticalScale(28),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: horizontalScale(6),
  },
  dot: {
    width: verticalScale(2),
    height: horizontalScale(2),
    borderRadius: moderateScale(6 / 2),
    backgroundColor: defaultTheme.INPUT_PLACEHOLDER_TEXT_COLOR,
  },
  containerStyleProps: {
    flex: 1,
  },
});
