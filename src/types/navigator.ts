import type { StackScreenProps } from "@react-navigation/stack";
import { EventPricingType, EventType } from "./event";

export type GuestStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ResetPasswordConfirmation: undefined;
  ForgotPassword: undefined;
};

export type ProtectedStackParamList = {
  Home: undefined;
  Account: undefined;
  Event: { eventId: number };
  Favorite: undefined;
  Search: undefined;
  Tickets: undefined;
  Ticket: {
    ticketId: number;
  };
  Checkout: {
    event: EventType;
    quantity: number;
    price?: EventPricingType;
  };
  PaymentSuccess: {
    event: EventType;
    quantity: number;
    type: "Carte Bancaire" | "Mobile Money";
    price?: EventPricingType;
    data?: any;
  };
  HomeStack: undefined;
};

export type GuestStackProps = StackScreenProps<GuestStackParamList>;

export type ProtectedStackProps = StackScreenProps<GuestStackParamList>;

export type HomeScreenProps = StackScreenProps<ProtectedStackParamList, "Home">;

export type EventScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Event"
>;

export type SearchScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Search"
>;
export type TicketsScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Tickets"
>;
export type TicketScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Ticket"
>;
export type FavoriteScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Favorite"
>;
export type AccountScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Account"
>;
export type CheckoutScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "Checkout"
>;
export type PaymentSuccessScreenProps = StackScreenProps<
  ProtectedStackParamList,
  "PaymentSuccess"
>;
