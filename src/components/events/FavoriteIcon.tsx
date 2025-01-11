import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { horizontalScale, moderateScale } from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { SIZES } from "src/constants/App";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventType } from "src/types/event";
import { useContext, useEffect, useState } from "react";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { AuthContext } from "src/contexts/AuthContext";
import { Favorite } from "src/services/favoriteService";

export const FavoriteIcon: React.FC<{ event: EventType }> = ({ event }) => {
  const { dispatch } = useContext(AuthContext);
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const queryKey = ["favorites", "event", event.id];
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  useEffect(() => {
    setIsFavorite(event.is_favorite ?? false);
    // console.log('enement : ', event.is_favorite)
  }, [event.is_favorite]);

  const { mutateAsync: addToFavorite } = useMutation({
    mutationFn: async () => await Favorite.add(event.id, true),
    onMutate: () => {
      toggleLoading(true);
    },
    onSettled: (data) => {
      if (data && data.success) {
        toggleLoading(false);
        return;
      }
      if (data && data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (data && !data.success && data.errors) {
        toggleLoading(false);
        return;
      }
      toggleLoading(false);
    },
  });

  const { mutateAsync: removeToFavorite } = useMutation({
    mutationFn: async () => await Favorite.remove(event.id, true),
    onMutate: () => {
      toggleLoading(true);
    },
    onSettled: (data) => {
      if (data && data.success) {
        toggleLoading(false);
        return;
      }
      if (data && data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (data && !data.success && data.errors) {
        toggleLoading(false);
        return;
      }
      toggleLoading(false);
    },
  });

  const handleFavorite = async () => {
    if (isFavorite) {
      await removeToFavorite();
      setIsFavorite(false);
    } else {
      await addToFavorite();
      setIsFavorite(true);
    }
    queryClient.invalidateQueries({ queryKey: queryKey });
    queryClient.invalidateQueries({
      queryKey: ["events", "event", event.id],
    });

    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  return (
    <View style={styles.navigatorRightButton}>
      <Ionicons
        style={styles.iconContainer}
        name={isFavorite ? "heart" : "heart-outline"}
        size={moderateScale(25)}
        color={
          isFavorite
            ? defaultTheme.DANGER_COLOR
            : defaultTheme.PRIMARY_TEXT_COLOR
        }
        onPress={handleFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  navigatorRightButton: {
    paddingRight: horizontalScale(SIZES.base + 4 - 3),
    position: "relative",
  },
  iconContainer: {
    textAlign: "center",
  },
});
