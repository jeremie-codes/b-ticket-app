import { Image, StyleSheet } from "react-native";
import { moderateScale } from "src/constants/Metric";
import React from "react";
import { ProgressiveImage } from "../image/ProgressiveImage";

type AccountAvatarPhotoType = {
  uri?: any;
  style?: object;
  local?: boolean;
};

export const AccountAvatarPhoto: React.FC<AccountAvatarPhotoType> = ({
  uri,
  style,
  local = false,
}: AccountAvatarPhotoType) => {
  const uriString =
    uri ??
    "https://cdn-icons-png.flaticon.com/512/727/727399.png?w=360&t=st=1684736578~exp=1684737178~hmac=4de587f0708df36c5272e1c6c2ff45aed23924172f22ec1fb53ba40fe6635bcd";
  return (
    <React.Fragment>
      {local && (
        <Image style={{ ...styles.avatar, ...style }} source={uriString} />
      )}
      {!local && (
        <ProgressiveImage
          source={{ uri: uriString }}
          thumbnailSource={{ uri: uriString }}
          style={{ ...styles.avatar, ...style }}
        />
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(50),
  },
});
