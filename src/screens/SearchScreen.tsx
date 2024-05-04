import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { AppSeparator, HeaderTitle } from "src/components";
import AppWrapper from "src/components/AppWrapper";
import { RenderBottomEventList } from "src/components/events/RenderBottomEventList";
import { RenderEventHeader } from "src/components/events/RenderEventHeader";
import { AppInput } from "src/components/form";
import { AppBadge } from "src/components/ui/badges/AppBadge";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { EventType } from "src/types/event";
import { SearchScreenProps } from "src/types/navigator";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";
import { useDebounce } from "src/hooks/useDebounce";
import EmptyList from "src/components/ui/layouts/EmptyList";
import { FlatListLoader } from "src/components/ui/flatList-scroll/FlatListLoader";
import { useAllEvent } from "src/hooks/useAllEvent";
import { defaultTheme } from "src/themes";
import { AppIcon } from "src/components/ui/icons";

export type PeriodType = "today" | "tomorrow" | "week" | null;

export const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>(null);
  const [period, setPeriod] = useState<PeriodType | null>(null);
  const [search, setSearch] = useState("");
  const { debounceValue } = useDebounce(search);
  const queryKey = ["events", "all", period || "null", debounceValue];

  const {
    isFetching,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    events,
    dataResponse,
  } = useAllEvent(queryKey, debounceValue, period);

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetching) {
      return <FlatListLoader />;
    }

    /* if (!isLoading && !isFetchingNextPage && !hasNextPage) {
      return <NoMoreResult />;
    } */

    return null;
  };

  const handleEventPress = (eventId: number) => {
    navigation.navigate("Event", {
      eventId: eventId,
    });
  };

  const handleOnChangeSearchText = (inputText: string) => {
    setSearch(inputText);
  };

  const handleOnChangePeriodText = (inputText: PeriodType) => {
    if (inputText === activePeriod) {
      setPeriod(null);
      setActivePeriod(null);
      return;
    }
    setPeriod(inputText);
    setActivePeriod(inputText);
  };

  return (
    <AppWrapper>
      <Pressable style={{ flexGrow: 1 }} onPress={Keyboard.dismiss}>
        <HeaderTitle>Recherche</HeaderTitle>
        <View style={styles.searchFormContainer}>
          <AppInput
            icon={
              <AppIcon
                type="ionicons"
                size={moderateScale(26)}
                name="search"
                color={defaultTheme.BODY_TEXT_COLOR}
                style={{ margin: -5, padding: -3 }}
              />
            }
            onChangeText={handleOnChangeSearchText}
            placeholder="Trouver rapidement un événement..."
          />
        </View>
        <AppSeparator />

        {dataResponse?.success && (
          <View style={styles.badgeContainer}>
            <AppBadge
              onPress={handleOnChangePeriodText.bind(this, "today")}
              active={activePeriod === "today"}
              label="Aujourd'hui"
            />
            <AppBadge
              onPress={handleOnChangePeriodText.bind(this, "tomorrow")}
              active={activePeriod === "tomorrow"}
              label="Demain"
            />
            <AppBadge
              onPress={handleOnChangePeriodText.bind(this, "week")}
              label="Cette semaine"
              active={activePeriod === "week"}
            />
          </View>
        )}
        <View style={{ flex: 1 }}>
          {!isFetching && !isLoading && !dataResponse?.success && (
            <FallbackFetchError
              message={dataResponse?.message}
              onPress={refetch}
            />
          )}

          {dataResponse?.success && events.length < 1 && (
            <EmptyList
              title="Aucun résultat"
              subtitle="Aucun événement trouvé pour cette recherche."
            />
          )}
          {events.length > 0 && (
            <RenderEventHeader title="Événements" actionOnPress={() => {}} />
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
        </View>
      </Pressable>
    </AppWrapper>
  );
};

const RenderBottomEventListMenu = React.memo(
  ({ item, onShowEvent }: { item: EventType; onShowEvent: () => void }) => {
    return <RenderBottomEventList onPress={onShowEvent} item={item} />;
  }
);

const styles = StyleSheet.create({
  searchFormContainer: {
    gap: moderateScale(10),
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(15),
  },
  searchInput: {},
  gap: {
    gap: moderateScale(15),
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(15),
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: verticalScale(14),
    gap: moderateScale(10),
  },
});
