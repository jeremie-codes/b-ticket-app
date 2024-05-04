import * as ImageManipulator from "expo-image-manipulator";

export const resizeImage = async ({
  uri,
  maxWidth,
  maxHeight,
  format,
  compressOptions,
}: ResizeImageParams): Promise<string> => {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth, height: maxHeight } }],
    { format, compress: compressOptions }
  );

  // manipResult.uri contains the URI of the resized image
  // manipResult.width and manipResult.height contain the dimensions of the resized image
  // You can use the resized image URI for further processing or display.

  return manipResult.uri;
};

//uri: `${APP_STORAGE_LINK}/${media[1]?.id}/${media[1]?.file_name}`,

interface ResizeImageParams {
  uri: string;
  maxWidth: number;
  maxHeight?: number;
  format: ImageManipulator.SaveFormat;
  compressOptions?: number | undefined; // Add union type of number | undefined
}

export const handleResizeImage = async ({
  imageUrl,
  maxWidth = 500,
  maxHeight,
  compressOptions = 0.5, // Provide a default value for compressOptions
}: {
  imageUrl: string;
  maxWidth?: number;
  maxHeight?: number;
  compressOptions?: number; // Make compressOptions optional
}) => {
  const returnValue = await resizeImage({
    uri: imageUrl,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    format: ImageManipulator.SaveFormat.JPEG,
    compressOptions: compressOptions, // Pass in compressOptions
  });
  return returnValue;
};
