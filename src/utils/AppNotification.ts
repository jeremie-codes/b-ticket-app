import { showMessage } from "react-native-flash-message";

const simple = (
  message: string,
  type: string = "info",
  description?: string
) => {
  switch (type) {
    case "error":
      showMessage({
        message: message,
        description: description,
        type: "danger",
        icon: "danger",
      });
      break;
    case "success":
      showMessage({
        message: message,
        description: description,
        type: "success",
        icon: "success",
      });
      break;
    default:
      showMessage({
        message: message,
        description: description,
        type: "info",
        icon: "info",
      });
      break;
  }
};

export const AppNotification = {
  simple,
};
