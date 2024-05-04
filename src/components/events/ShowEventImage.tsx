import { StyleSheet, View } from "react-native";
import React from "react";
import { horizontalScale, moderateScale } from "src/constants/Metric";
import { ProgressiveImage } from "../ui/image/ProgressiveImage";

type EventImageType = {
  fileNameUrl: string;
  thumbnailSource: string;
};

export const ShowEventImage: React.FC<EventImageType> = ({
  fileNameUrl,
  thumbnailSource,
}) => {
  return (
    <View style={styles.avatarContainer}>
      <ProgressiveImage
        thumbnailSource={{ uri: thumbnailSource }}
        source={{ uri: fileNameUrl }}
        style={styles.avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    overflow: "hidden",
  },
  avatar: {
    height: horizontalScale(300),
    borderRadius: moderateScale(7),
  },
});
