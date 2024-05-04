import { API_URL } from "@env";
import { useState, useEffect } from "react";
import { handleResizeImage } from "src/utils/Image";

export const useLoadNormalImage = (
  fileNameUrl: string | undefined,
  maxWidth: number,
  slashPrefix?: boolean,
  notFromApi?: boolean
) => {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadImage = async () => {
      if (fileNameUrl) {
        let path =
          API_URL +
          `${slashPrefix ? "/" : ""}${fileNameUrl}?buster=${Math.random()}`;


        const generatedImage = await handleResizeImage({
          imageUrl: path.replace("/api", "/"),
          maxWidth: maxWidth,
        });
        setFilePath(generatedImage);
      }
    };

    loadImage();
  }, [fileNameUrl]);

  return { filePath };
};
