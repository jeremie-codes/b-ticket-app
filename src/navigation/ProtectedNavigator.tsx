import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { HomeScreen } from "src/screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppIcon } from "src/components/ui/icons";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { SIZES } from "src/constants/App";
import { defaultTheme } from "src/themes";
import { BlurView } from "expo-blur";
import { IconType } from "src/components/ui/icons/AppIcon";
import { EventScreen } from "src/screens/EventScreen";
import { SearchScreen } from "src/screens/SearchScreen";
import { TicketsScreen } from "src/screens/TicketsScreen";
import { FavoriteScreen } from "src/screens/FavoriteScreen";
import { AccountScreen } from "src/screens/AccountScreen";
import { ProtectedStackParamList } from "src/types/navigator";
import { CheckoutScreen } from "src/screens/checkout/CheckoutScreen";
import PaymentSuccess from "src/screens/checkout/PaymentSuccess";
import { TicketScreen } from "src/screens/TicketScreen";

const Stack = createStackNavigator<ProtectedStackParamList>();
const Tab = createBottomTabNavigator<ProtectedStackParamList>();

export function ProtectedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeStack"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Ticket" component={TicketScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen
        name="PaymentSuccess"
        options={{ headerShown: false, gestureEnabled: false }}
        component={PaymentSuccess}
      />
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        //tabBarShowLabel: false,
        tabBarInactiveTintColor: defaultTheme.PRIMARY_TEXT_COLOR,
        tabBarActiveTintColor: defaultTheme.SECONDARY_TEXT_COLOR,
        tabBarStyle: {
          height: horizontalScale(SIZES.large + 25),
          backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
          borderTopLeftRadius: moderateScale(SIZES.base + 12),
          borderTopRightRadius: moderateScale(SIZES.base + 12),
          paddingBottom: verticalScale(SIZES.base + 15),
          borderBottomWidth: 0,
          borderTopWidth: 0,
          elevation: 0,
          overflow: "hidden",
          //paddingTop: verticalScale(20),
          //position: "absolute",
        },

        tabBarIconStyle: {
          marginBottom: 0,
          paddingBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(SIZES.base - 5),
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconType = "ionicons" as IconType;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home-sharp" : "home-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search";
              break;
            case "Tickets":
              iconName = focused
                ? "ticket-confirmation"
                : "ticket-confirmation-outline";
              iconType = "materialCommunityIcons";
              break;
            case "Favorite":
              iconName = focused ? "cards-heart" : "cards-heart-outline";
              iconType = "materialCommunityIcons";
              break;
            default:
              iconName = focused ? "account-circle" : "account-circle-outline";
              iconType = "materialCommunityIcons";
              break;
          }
          return (
            <AppIcon
              type={iconType}
              name={iconName}
              size={moderateScale(size)}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        options={{ headerShown: false, tabBarLabel: "Accueil" }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarLabel: "Recherche" }}
        name="Search"
        component={SearchScreen}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarLabel: "Billets" }}
        name="Tickets"
        component={TicketsScreen}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarLabel: "Favoris" }}
        name="Favorite"
        component={FavoriteScreen}
      />
      <Tab.Screen
        options={({ route }) => ({
          /* tabBarStyle: ((route) => {
            if (route.name === "Account") {
              return { display: "none" };
            }
            return;
          })(route), */
          tabBarLabel: "Compte",
        })}
        name="Account"
        component={AccountScreen}
      />
    </Tab.Navigator>
  );
}
