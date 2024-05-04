import { Alert, Image, StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";
import {
  PermissionStatus,
  useMediaLibraryPermissions,
  MediaTypeOptions,
  launchImageLibraryAsync,
} from "expo-image-picker";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { SIZES } from "src/constants/App";
import { AuthContext } from "src/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "src/services/userService";
import { OverlayLoadingContext } from "src/contexts/OverlayLoadingContext";
import { UserType } from "src/types/auth";
import { useLoadNormalImage } from "src/hooks/useLoadNormalImage";
import { AppTextBody } from "../ui/texts/AppTextBody";
import { ClickableWrapper } from "src/components/ClickableWrapper";
import { AppIcon } from "src/components/ui/icons";
import { ProgressiveImage } from "../ui/image/ProgressiveImage";

type IProps = {
  handleGoBack: () => void;
  user: UserType;
};
export type IImageType = {
  uri: string;
  name: string;
  type: string;
};
const AccountProfilePicture: React.FC<IProps> = ({ user }: IProps) => {
  const { dispatch, state } = useContext(AuthContext);
  const [image, setImage] = useState<IImageType>();
  //const [cameraPermissionInformation, requestPermission] =useCameraPermissions();
  const [mediaLibraryPermissionInformation, requestMediaPermission] =
    useMediaLibraryPermissions();
  const { toggleLoading } = useContext(OverlayLoadingContext);
  const queryKey = ["user", "profile"];
  const queryClient = useQueryClient();

  const { mutateAsync: onUpdateProfilePicture } = useMutation({
    mutationFn: async (data: any) => await User.storeProfilePicture(data, true),
    onMutate: () => {
      toggleLoading(true);
    },
    onSettled: (data) => {
      if (data.success) {
        dispatch({ type: "UPDATE_PICTURE", payload: data.data.picture });
        queryClient.invalidateQueries({ queryKey: queryKey });
        toggleLoading(false);
        return;
      }
      if (data.message === "Unauthenticated.") {
        toggleLoading(false);
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (!data.success && data.errors) {
        toggleLoading(false);
        return;
      }
    },
  });

  /*  async function verifyPermissions() {
    if (
      cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED ||
      cameraPermissionInformation?.canAskAgain
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permissions insuffisantes !",
        "Vous devez accorder des autorisations à la caméra pour utiliser cette application."
      );
      return false;
    }

    return true;
  } */

  async function mediaPermission() {
    if (
      mediaLibraryPermissionInformation?.status ===
        PermissionStatus.UNDETERMINED ||
      mediaLibraryPermissionInformation?.canAskAgain
    ) {
      const permissionResponse = await requestMediaPermission();

      return permissionResponse.granted;
    }

    if (mediaLibraryPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permissions insuffisantes !",
        "Vous devez accorder des autorisations à la bibliothèque multimédia pour utiliser cette application."
      );
      return false;
    }

    return true;
  }

  const pickImage = async () => {
    const hasPermission = await mediaPermission();

    if (!hasPermission) {
      return;
    }
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      quality: 0.5,
      aspect: [4, 3],
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split("/").pop() || "";
      const fileType = uri.split(".").pop();

      const newImage = {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      };

      setImage(newImage);
      await onUpdateProfilePicture(newImage);
    }
  };

  const { filePath } = useLoadNormalImage(user?.profile?.picture, 500, true);
  const { filePath: thumbnail } = useLoadNormalImage(
    user?.profile?.picture,
    100,
    true
  );

  return (
    <View style={styles.avatarContainer}>
      <ClickableWrapper onPress={pickImage} style={styles.imageWrapper}>
        {!image?.uri && !user?.profile?.picture ? (
          <Image
            source={
              !image?.uri && !user?.profile?.picture
                ? require("../../assets/img/profile.jpeg")
                : {
                    uri: image?.uri || filePath,
                  }
            }
            style={styles.avatar}
          />
        ) : (
          <ProgressiveImage
            source={{ uri: image?.uri || filePath }}
            thumbnailSource={{ uri: image?.uri || thumbnail }}
            style={styles.avatar}
          />
        )}
        <View style={styles.iconContainer}>
          <AppIcon
            type="ionicons"
            name="camera-outline"
            size={moderateScale(20)}
            color={defaultTheme.PRIMARY_TEXT_COLOR}
          />
        </View>
      </ClickableWrapper>
      <View style={styles.profileTextContainer}>
        <View>
          <AppTextBody style={styles.nameText}>
            {state.user?.profile?.first_name && state.user?.profile?.last_name
              ? `${state.user?.profile?.first_name} ${state.user?.profile?.last_name}`
              : state.user?.name}
          </AppTextBody>
        </View>
        <View>
          <AppTextBody style={styles.email}>{state.user?.email}</AppTextBody>
        </View>
      </View>
    </View>
  );
};

export default AccountProfilePicture;

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(5),
  },
  imageWrapper: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    bottom: verticalScale(12),
    right: verticalScale(-3),
    backgroundColor: defaultTheme.SECONDARY_BACKGROUND_COLOR,
    paddingHorizontal: verticalScale(5),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(15),
  },
  profileTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(20),
    gap: moderateScale(7),
  },
  linear: {
    height: horizontalScale(40),
  },
  nameText: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  email: {},
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: defaultTheme.PRIMARY_BACKGROUND_COLOR,
    // position: "absolute",
    width: "100%",
    paddingHorizontal: horizontalScale(SIZES.base + 4),
    paddingTop: verticalScale(SIZES.base - 4),
  },
  avatar: {
    height: horizontalScale(120),
    width: verticalScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 2,
    borderColor: defaultTheme.MUTED_TEXT_COLOR,
  },
});
