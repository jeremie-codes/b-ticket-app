import { IconType } from "src/components/ui/icons/AppIcon";

export type AccountMenuType = {
  label: string;
  iconName: string;
  iconType: IconType;
  iconSize: number;
  onPress: Function;
};
export const ACCOUNT_MENU_ITEMS: AccountMenuType[] = [
  {
    label: "Aide",
    iconName: "help-circle-outline",
    iconType: "ionicons",
    iconSize: 30,
    onPress: () => {},
  },
  {
    label: "Paramètres",
    iconName: "settings-outline",
    iconType: "ionicons",
    iconSize: 27,
    onPress: () => {},
  },
];
