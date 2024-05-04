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
      `${endpoints.allEvents}?search=${search}&period=${period}&page=${page}`,
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
    const { data } = await http.get(endpoints.recents, { headers });

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
    const { data } = await http.get(endpoints.popular, { headers });

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
    const { data } = await http.get(endpoints.group, { headers });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      if (data.message === "Unauthenticated.") {
        await AppLocalStorage.removeItem("user");
      }
    }

    return data;
  },
  getOne: async (eventId: number, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get(`${endpoints.getEvent}${eventId}`, {
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
};
