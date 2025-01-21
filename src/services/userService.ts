import endpoints from "src/constants/Endpoint";
import { http } from ".";
import { loadUserFromStorage } from "src/contexts/AuthContext";
import { AppLocalStorage, AppNotification } from "src/utils";
import { IImageType } from "src/components/account/AccountProfilePicture";

export const User = {
  getProfile: async (withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };
    const { data } = await http.get(`https://b-tickets-app.com/api/profile`, {
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

  storeProfile: async (profileData: any, withNotification = false) => {
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };

    // console.log('profil user: ',user)
    const { data } = await http.post(
      `https://b-tickets-app.com/api/profile`,
      {
        ...profileData,
      },
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

  storeProfilePicture: async (
    profileData: IImageType,
    withNotification = false
  ) => {
    
    const user = await loadUserFromStorage();
    const headers = {
      Authorization: "Bearer " + user?.token!,
      // "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();

    formData.append("picture", {
      uri: profileData.uri,
      name: profileData.name,
      type: `image/${profileData.type}`,
    } as any);

    const { data } = await http.post(`https://b-tickets-app.com/api/profile/picture`, formData, {
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
