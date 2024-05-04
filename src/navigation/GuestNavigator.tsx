import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "src/screens/Welcome";
import { Login } from "src/screens/auth/Login";
import { StyleSheet } from "react-native";
import { SignUp } from "src/screens/auth/SignUp";
import { ForgotPassword } from "src/screens/auth/ForgotPassword";
import { ResetPasswordConfirmation } from "src/screens/auth/ResetPasswordConfirmation";
import { GuestStackParamList } from "src/types/navigator";

const Stack = createStackNavigator<GuestStackParamList>();

export function GuestNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="ResetPasswordConfirmation"
        component={ResetPasswordConfirmation}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
