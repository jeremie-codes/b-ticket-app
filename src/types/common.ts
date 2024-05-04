import { EventType } from "src/types/event";

export type SectionListType = {
  items: EventType[];
  title: string;
  horizontal?: boolean;
};
