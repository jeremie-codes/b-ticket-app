import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import "react-native-gesture-handler";

import {
  Epilogue_400Regular,
  Epilogue_700Bold,
  Epilogue_600SemiBold,
  Epilogue_500Medium,
  Epilogue_300Light,
} from "@expo-google-fonts/epilogue";
import { useCallback, useEffect, useState } from "react";
import { defaultTheme } from "src/themes";
import { AppNavigator } from "src/navigation";
import { moderateScale, verticalScale } from "src/constants/Metric";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FlashMessage from "react-native-flash-message";
import OverlayLoadingProvider from "src/contexts/OverlayLoadingContext";
import { AuthProvider } from "src/contexts/AuthContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          Epilogue_400Regular,
          Epilogue_700Bold,
          Epilogue_600SemiBold,
          Epilogue_500Medium,
          Epilogue_300Light,
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OverlayLoadingProvider>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <AppNavigator />
            <StatusBar style={defaultTheme.STATUS_BAR_STYLE} />
          </View>
          <FlashMessage
            position="top"
            duration={3000}
            statusBarHeight={moderateScale(35)}
          />
        </OverlayLoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    paddingTop: Platform.OS === "android" ? verticalScale(0) : 0,
  },
});
