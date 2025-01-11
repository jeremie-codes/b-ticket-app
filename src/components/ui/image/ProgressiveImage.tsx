import React, { useRef, useState, useEffect } from "react";
import {
  ImageStyle,
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { defaultTheme } from "src/themes";

export const ProgressiveImage = ({
  source,
  thumbnailSource,
  style,
}: {
  source: { uri: string | undefined };
  thumbnailSource: { uri: string | undefined };
  style: ImageStyle;
}) => {
  const thumbnailAnimated = useRef(new Animated.Value(0)).current;
  const imageAnimated = useRef(new Animated.Value(0)).current;
  const [image, setImage] = useState({});

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    console.log(thumbnailSource)
  })

  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[
        styles.container,
        { borderRadius: (style as ImageStyle)?.borderRadius },
      ]}
    >
      {source.uri !== undefined && (
        <React.Fragment>
          <Animated.Image
            source={thumbnailSource}
            style={[style, { opacity: thumbnailAnimated }]}
            blurRadius={2}
            onLoad={handleThumbnailLoad}
          />
          <Animated.Image
            source={source}
            style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
            onLoad={onImageLoad}
          />
        </React.Fragment>
      )}

      {source.uri === undefined && (
        <View style={[styles.imageLoader, style]}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: defaultTheme.FORM_BACKGROUND_COLOR,
  },
  imageLoader: {
    alignContent: "center",
    justifyContent: "center",
  },
});
