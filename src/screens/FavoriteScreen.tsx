import { StyleSheet, View, Platform } from "react-native";
import { HeaderTitle } from "src/components";
import EmptyList from "src/components/ui/layouts/EmptyList";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { defaultTheme } from "src/themes/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import AppWrapper from "src/components/AppWrapper";
import { FavoriteScreenProps } from "src/types/navigator";
import React, { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Favorite } from "src/services/favoriteService";
import { PaginatorResponseType, ResponseType } from "src/types/response";
import { FlatListLoader } from "src/components/ui/flatList-scroll/FlatListLoader";
import { EventType } from "src/types/event";
import { FlatList } from "react-native-gesture-handler";
import { RenderBottomEventList } from "src/components/events/RenderBottomEventList";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";

export const FavoriteScreen = ({ navigation }: FavoriteScreenProps) => {
  const { dispatch } = useContext(AuthContext);
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const queryKey = ["favorites"];

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
      return Favorite.all(pageParam, true);
    },

    getNextPageParam: (lastPage) => {
      const paginator: PaginatorResponseType = lastPage?.data;
      return paginator?.has_more ? paginator.current_page + 1 : undefined;
    },
    //staleTime: Infinity, // Data is considered always fresh, disable re-fetching
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

    /*  if (!isLoading && !isFetchingNextPage && !hasNextPage) {
      return <NoMoreResult />;
    } */

    return null;
  };

  const events: EventType[] =
    data?.pages.flatMap((page) => page?.data?.data) || [];

  const dataResponse: ResponseType =
    data?.pages.flatMap((page) => page)[0] || {};

  const handleEventPress = (eventId: number) => {
    navigation.navigate("Event", {
      eventId: eventId,
    });
  };

  return (
    <AppWrapper>
      <View style={styles.eventHeader}>
        <HeaderTitle>Événement sauvegardé</HeaderTitle>
        <AppTextBody>
          {events.length} Événement{`${events.length > 1 ? "s" : ""}`}
        </AppTextBody>
      </View>
      {!isFetching && !isLoading && !dataResponse?.success && (
        <FallbackFetchError message={dataResponse?.message} onPress={refetch} />
      )}
      {dataResponse?.success && events.length < 1 && (
        <EmptyList
          title="Pas d'événements sauvegardés"
          subtitle="Veuillez à sauvegarder les événements qui vous intéressent afin de ne
            manquer aucune information."
        />
      )}
      {events.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gap}
          data={events}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <RenderBottomEventListMenu
              onShowEvent={handleEventPress.bind(this, item.id)}
              item={item}
              key={item.id}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </AppWrapper>
  );
};

const RenderBottomEventListMenu = React.memo(
  ({ item, onShowEvent }: { item: EventType; onShowEvent: () => void }) => {
    return <RenderBottomEventList onPress={onShowEvent} item={item} />;
  }
);

const styles = StyleSheet.create({
  eventHeader: {
    // flex: 1,
    paddingBottom: verticalScale(15),
    paddingTop: Platform.OS === "android" ? verticalScale(30) : 0,
  },
  navigatorRightButton: {
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    paddingLeft: horizontalScale(SIZES.base + 4 - 10),
  },
  gap: {
    gap: moderateScale(15),
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(75),
  },
});
