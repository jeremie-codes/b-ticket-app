import { LoginData, PasswordResetType, RegisterData } from "src/types/auth";
import { AppLocalStorage, AppNotification } from "src/utils";
import { http } from ".";
import endpoints from "src/constants/Endpoint";
import { loadUserFromStorage } from "src/contexts/AuthContext";

export const Auth = {
  login: async (loginData: LoginData, withNotification = false) => {
    // Make API call to authenticate user
    const { data } = await http.post(endpoints.login, {
      ...loginData,
    });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      return data;
    }

    // If authentication is successful, store user data in local storage
    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }
    const user: User = data.data.user;
    await AppLocalStorage.setItem(
      "user",
      JSON.stringify({ ...user, token: data.data.token })
    );

    return data;
  },

  register: async (registerData: RegisterData, withNotification = false) => {
    // Make API call to authenticate user
    const { data } = await http.post(endpoints.signup, {
      ...registerData,
    });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
      return data;
    }

    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }

    // If authentication is successful, store user data in local storage
    const user: User = data.data.user;
    await AppLocalStorage.setItem(
      "user",
      JSON.stringify({ ...user, token: data.data.token })
    );

    return data;
  },

  forgot: async (passwordData: PasswordResetType, withNotification = false) => {
    // Make API call to authenticate user
    const { data } = await http.post(endpoints.forgot, {
      ...passwordData,
    });

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
    }

    // If authentication is successful, store user data in local storage
    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }

    return data;
  },

  logout: async (withNotification = false) => {
    // Make API call to logout user
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };

    const { data } = await http.post(endpoints.logout, {}, { headers });
    await AppLocalStorage.removeItem("user");

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
    }

    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }

    // Clear user data from local storage
    await AppLocalStorage.removeItem("user");
    return data;
  },
  deleteAccount: async (withNotification = false) => {
    // Make API call to logout user
    const user = await loadUserFromStorage();
    const headers = { Authorization: "Bearer " + user?.token! };

    const { data } = await http.post(endpoints.deleteUser, {}, { headers });
    await AppLocalStorage.removeItem("user");

    if (!data.success && withNotification) {
      AppNotification.simple(data.message, "error");
    }

    if (data.success && withNotification) {
      AppNotification.simple(data.message, "success");
    }

    // Clear user data from local storage
    await AppLocalStorage.removeItem("user");
    return data;
  },
};
