import React from "react";
import { ProgressiveImage } from "../ui/image/ProgressiveImage";
import { ImageStyle } from "react-native";

type EventImageType = {
  fileNameUrl: string;
  thumbnailSource: string;
  style: ImageStyle;
};

export const EventImage: React.FC<EventImageType> = ({
  fileNameUrl,
  thumbnailSource,
  style,
}) => {
  return (
    <React.Fragment>
      <ProgressiveImage
        style={style}
        thumbnailSource={{ uri: thumbnailSource }}
        source={{ uri: fileNameUrl }}
      />
    </React.Fragment>
  );
};
