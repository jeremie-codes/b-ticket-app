import { EventType } from "src/types/event";

export type TicketType = {
  created_at: "2023-06-25T13:29:11.000000Z";
  currency: "usd" | "cdf";
  event: EventType;
  event_id: number;
  id: number;
  payment_method: "mobile" | "card";
  qrcode?: string | null;
  quantity: number;
  reference: string;
  success: number;
  tickets: [];
  total_amount: number;
  unit_amount: number;
  updated_at: string;
  used_at?: string | null;
  user_id: 4;
};
