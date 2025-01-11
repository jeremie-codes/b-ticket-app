import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useContext } from "react";
import LoadingOverlay from "src/components/ui/LoadingOverlay";
import { AuthContext } from "src/contexts/AuthContext";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { GuestNavigator } from "src/navigation/GuestNavigator";
import { ProtectedNavigator } from "src/navigation/ProtectedNavigator";
import { defaultTheme } from "src/themes";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function AppNavigator() {
  const { state } = useContext(AuthContext);
  const { loading } = useContext(OverlayLoadingContext);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    },
  };

  return (
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
            <NavigationContainer theme={MyTheme}>
              {state.isAuthenticated ? <ProtectedNavigator /> : <GuestNavigator />}
            </NavigationContainer>
            {loading && <LoadingOverlay />}
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
  );
}
