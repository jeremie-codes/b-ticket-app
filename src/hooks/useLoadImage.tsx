import { useState, useEffect } from "react";
import { handleResizeImage } from "src/utils/Image";
import { EventType } from "src/types/event";
import { APP_STORAGE_LINK } from "@env";

export const useLoadImage = (
  item: EventType,
  maxWidth: number,
  mediaIndex: number = 1
) => {
  const [filePath, setFilePath] = useState< string | undefined>(undefined);

  useEffect(() => {
    const loadImage = async () => {
      if (item.author_name !== '') {
        const fileNameUrl = `https://b-tickets-app.com//storage/${
          item.media[mediaIndex]?.id
        }/${item.media[mediaIndex]?.file_name}?buster=${Math.random()}`;
        // const generatedImage = await handleResizeImage({
        //   imageUrl: fileNameUrl,
        //   maxWidth: maxWidth,
        // });
        setFilePath(fileNameUrl);
      }
    };

    loadImage();
  }, [item.author_name]);

  return { filePath };
};
