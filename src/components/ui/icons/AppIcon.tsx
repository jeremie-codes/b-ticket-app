import { StyleSheet, View } from "react-native";
import { FC } from "react";
import {
  Entypo,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  Octicons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

export type AppIconType = {
  name: any;
  size: number;
  color: string;
  type?: IconType;
  style?: object;
};

export type IconType =
  | "feather"
  | "ionicons"
  | "materialCommunityIcons"
  | "entypo"
  | "fontAwesome5"
  | "material"
  | "octicons";

const icons = {
  feather: Feather,
  ionicons: Ionicons,
  materialCommunityIcons: MaterialCommunityIcons,
  entypo: Entypo,
  octicons: Octicons,
  material: MaterialIcons,
  fontAwesome5: FontAwesome5,
};

export const AppIcon: FC<AppIconType> = ({
  name,
  size,
  color,
  type = "entypo",
  style,
}) => {
  const IconComponent = icons[type];
  return (
    <View style={[styles.buttonContainer, style]}>
      <IconComponent name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {},
});
