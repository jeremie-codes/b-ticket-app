import { FlatList, SectionList, StyleSheet, View } from "react-native";
import AppWrapper from "src/components/AppWrapper";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import { AppSeparator } from "src/components";
import { RenderEventItem } from "src/components/events/RenderEventItem";
import { RenderEventHeader } from "src/components/events/RenderEventHeader";
import { useQuery } from "@tanstack/react-query";
import { Event } from "src/services/eventService";
import { EventType } from "src/types/event";
import React, { useContext } from "react";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { AuthContext } from "src/contexts/AuthContext";
import { RenderBottomEventList } from "src/components/events/RenderBottomEventList";
import { transformDataList } from "src/utils/SectionList";
import { formattedDateUpper } from "src/utils/Date";
import { ScreenHeader } from "src/components/screens/ScreenHeader";
import { ClickableWrapper } from "src/components/ClickableWrapper";
import { AccountAvatarPhoto } from "src/components/ui/avatars/AccountAvatarPhoto";
import { HomeScreenProps } from "src/types/navigator";
import FallbackFetchError from "src/components/ui/layouts/FallbackFetchError";
import { API_URL } from "@env";
import { User } from "src/services/userService";

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const { dispatch } = useContext(AuthContext);

  const { state } = useContext(AuthContext);

  const {
    isLoading,
    isFetching,
    data: groupEvents,
    refetch,
  } = useQuery({
    queryKey: ["events", "group"],
    queryFn: () => {
      toggleLoading(true);
      return Event.group(true);
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
    //keepPreviousData: true,
  });

  let realData: {
    title: string;
    horizontal?: boolean;
    data: EventType[];
  }[] = [];

  if (groupEvents?.success) {
    const { allEvents, recentEvents, topEvents } = groupEvents?.data!;
    realData = [
      ...transformDataList({
        items: recentEvents,
        title: "Récents",
        horizontal: true,
      }),
      ...transformDataList({
        items: topEvents,
        title: "Populaires",
        horizontal: true,
      }),
      ...transformDataList({
        items: allEvents?.data,
        title: "Événements",
        horizontal: false,
      }),
    ];
  }

  const handleProfilePress = () => {
    navigation.navigate("Account");
  };

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  const handleEventPress = (eventId: number) => {
    navigation.navigate("Event", {
      eventId: eventId,
    });
  };

  const queryKey = ["user", "profile"];

  const { data: _ } = useQuery({
    queryKey: queryKey,
    staleTime: 60_000,
    enabled: true,
    queryFn: () => {
      toggleLoading(true);
      return User.getProfile(true);
    },
    onSettled(data) {
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (data.success) {
        dispatch({ type: "UPDATE_USER", payload: data.data });
      }

      toggleLoading(false);
    },
  });

  return (
    <AppWrapper>
      {!isFetching && !isLoading && !groupEvents?.success && (
        <FallbackFetchError message={groupEvents?.message} onPress={refetch} />
      )}
      {!isLoading && groupEvents?.success && (
        <ScreenHeader
          title={formattedDateUpper}
          subtitle={state.user?.name}
          image={
            <ClickableWrapper onPress={handleProfilePress}>
              {state.user?.profile?.picture ? (
                <AccountAvatarPhoto
                  uri={(API_URL + state.user?.profile?.picture).replace(
                    "/api",
                    "/"
                  )}
                  style={styles.headerRightIcon}
                />
              ) : (
                <AccountAvatarPhoto
                  uri={require("../assets/img/user.png")}
                  style={styles.headerRightIcon}
                  local={true}
                />
              )}
            </ClickableWrapper>
          }
        />
      )}

      {!isLoading && (
        <SectionList
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          sections={realData}
          contentContainerStyle={{ paddingBottom: verticalScale(10) }}
          renderSectionHeader={({ section }) => (
            <>
              <RenderEventHeader
                title={section.title}
                actionText="Tout voir"
                actionOnPress={handleSearchPress}
              />
              {section.horizontal ? (
                <View style={{ flexGrow: 1, flex: 1 }}>
                  <FlatList
                    horizontal
                    data={section.data}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={{ gap: moderateScale(SIZES.base) }}
                    renderItem={({ item }) => (
                      <RenderTopEventMenu
                        onShowEvent={handleEventPress.bind(this, item.id)}
                        item={item}
                      />
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                  <AppSeparator />
                </View>
              ) : null}
            </>
          )}
          renderItem={({ item, section }) => {
            if (section.horizontal) {
              return null;
            }
            return (
              <View style={styles.footerContainer}>
                <RenderBottomEventMenu
                  onShowEvent={handleEventPress.bind(this, item.id)}
                  item={item}
                />
              </View>
            );
          }}
        />
      )}
    </AppWrapper>
  );
};

const RenderBottomEventMenu = React.memo(
  ({ item, onShowEvent }: { item: EventType; onShowEvent: () => void }) => {
    return <RenderBottomEventList onPress={onShowEvent} item={item} />;
  }
);

const RenderTopEventMenu = React.memo(
  ({ item, onShowEvent }: { item: EventType; onShowEvent: () => void }) => {
    return <RenderEventItem onPress={onShowEvent} item={item} />;
  }
);

const styles = StyleSheet.create({
  headerRightIcon: {
    height: horizontalScale(34),
    width: verticalScale(34),
    borderRadius: moderateScale(17),
    //borderWidth: 1,
    //borderColor: defaultTheme.MUTED_TEXT_COLOR,
  },
  footerContainer: {
    marginVertical: verticalScale(6),
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
