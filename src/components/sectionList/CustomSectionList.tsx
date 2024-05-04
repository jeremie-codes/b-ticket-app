import { SectionList } from "react-native";
import { EventType } from "src/types/event";
const CustomSectionList: React.FC<{
  sections: {
    title: string;
    horizontal?: boolean;
    data: EventType[];
  }[];
  renderItem: ({
    item,
    section,
  }: {
    item: EventType;
    section: { horizontal?: boolean };
  }) => JSX.Element | null;
  renderSectionHeader: ({
    section,
  }: {
    section: { title: string };
  }) => JSX.Element;
}> = ({ sections, renderItem, renderSectionHeader }) => {
  return (
    <SectionList
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
    />
  );
};
