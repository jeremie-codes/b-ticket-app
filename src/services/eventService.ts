import endpoints from "src/constants/Endpoint";
import { http } from ".";
import { loadUserFromStorage } from "src/contexts/AuthContext";
import { AppLocalStorage, AppNotification } from "src/utils";

export const Event = {
  all: async (
    search?: string | null,
    period?: string | null,
    page: number = 1,
    withNotification = false
  ) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };

    const { data } = await http.get(
      `https://b-tickets-app.com/api/events?search=${search}&period=${period}&page=${page}`,
      { headers }
    );

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");

      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    return data;
  },
  recents: async (withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get('https://b-tickets-app.com/api/events/recents', { headers });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    return data;
  },
  popular: async (withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get("https://b-tickets-app.com/api/favorites/popular", { headers });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    return data;
  },
  group: async (withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get("https://b-tickets-app.com/api/favorites/group", { headers });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    return data;
  },
  getOne: async (eventId: number, withNotification = false, userId = null) => {
    // console.log('id du user',userId)
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get(`https://b-tickets-app.com/api/events/${eventId}/${userId}`, {
      headers,
    });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    // console.log(data)
    return data;
  },
};
