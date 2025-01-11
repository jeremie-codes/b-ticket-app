import endpoints from "src/constants/Endpoint";
import { http } from ".";
import { loadUserFromStorage } from "src/contexts/AuthContext";
import { AppLocalStorage, AppNotification } from "src/utils";
import { TicketStatusType } from "src/screens/TicketsScreen";

export const Ticket = {
  all: async (
    status?: TicketStatusType,
    page: number = 1,
    withNotification = false
  ) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };

    console.log(`status=${status}&page=${page}`)

    const { data } = await http.get(
      `${endpoints.tickets}?status=${status}&page=${page}`,
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

    return data;
  },
  one: async (ticketId: number, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get(`${endpoints.tickets}/${ticketId}`, {
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
  payTicket: async (ticketData: any, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.post(`${endpoints.payTicket}`, ticketData, {
      headers,
    });

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
