import endpoints from "src/constants/Endpoint";
import { http } from ".";
import { loadUserFromStorage } from "src/contexts/AuthContext";
import { AppLocalStorage, AppNotification } from "src/utils";

export const Favorite = {
  all: async (page: number = 1, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get(`${endpoints.favoriteList}?page=${page}`, {
      headers,
    });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");

      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    return data;
  },
  add: async (eventId: number, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.post(
      `${endpoints.addToFavorite}/${eventId}`,
      {},
      {
        headers,
      }
    );

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }

    return data;
  },
  remove: async (eventId: number, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.post(
      `${endpoints.removeToFavorite}/${eventId}`,
      {},
      {
        headers,
      }
    );

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }

    return data;
  },
};
