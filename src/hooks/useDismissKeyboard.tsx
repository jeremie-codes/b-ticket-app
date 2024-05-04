import { Keyboard } from "react-native";

export const useDismissKeyboard = () => {
  const handlePressOutside = () => {
    // Dismiss the keyboard
    Keyboard.dismiss();

    // Close the popup or perform other actions
    // You can access the popup ref and call its close method
    // For example: popupRef.current.close();
  };

  return {
    handlePressOutside,
  };
};
