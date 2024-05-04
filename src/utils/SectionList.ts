import { SectionListType } from "src/types/common";

export const transformDataList = (data: SectionListType) => {
  return [
    {
      title: data.title,
      horizontal: data?.horizontal,
      data: data.items,
    },
  ];
};
