import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { ClickableWrapper } from "../ClickableWrapper";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { EventType } from "src/types/event";
import { defaultTheme } from "src/themes";
import { AppIcon } from "../ui/icons";
import { SIZES } from "src/constants/App";
import React from "react";
import { useLoadImage } from "src/hooks/useLoadImage";
import { displayedAmount } from "src/utils/Currency";
import { formatDateFr } from "src/utils/Date";
import { EventImage } from "src/components/events/EventImage";

export const RenderBottomEventList = ({ item, onPress, }: { item: EventType; onPress?: () => void; }) => {
  const { filePath } = useLoadImage(item, 350);
  const { filePath: thumbnailSource } = useLoadImage(item, 50);

  return (
    <React.Fragment>
      <ClickableWrapper onPress={onPress} style={styles.container}>
        <EventImage
          style={styles.eventImage}
          thumbnailSource={thumbnailSource!}
          fileNameUrl={filePath!}
        />

        <View style={styles.metadataContainer}>
          <View style={styles.titleContainer}>
            <AppTextBody numberOfLines={2} style={styles.eventTitle}>
              {item.title}
            </AppTextBody>
          </View>
          <View style={styles.authorContainer}>
            <AppTextBody numberOfLines={1} style={styles.author}>
              {item.author_name} - {item.location.toUpperCase()}
            </AppTextBody>
          </View>
          <View style={styles.eventMetadataContainer}>
            <View style={styles.metadatItemContainer}>
              <AppIcon
                type="ionicons"
                name="calendar-outline"
                size={moderateScale(16)}
                color={defaultTheme.PRIMARY_TEXT_COLOR}
              />
              <AppTextBody style={styles.eventMetadataText}>
                {formatDateFr(item.date)}
              </AppTextBody>
            </View>
            {item?.prices[0] && (
              <View style={styles.metadatItemContainer}>
                <AppIcon
                  type="materialCommunityIcons"
                  name="ticket-confirmation-outline"
                  size={moderateScale(16)}
                  color={defaultTheme.PRIMARY_TEXT_COLOR}
                />

                <AppTextBody style={styles.eventMetadataText}>
                  {item?.prices[0].amount && (
                    <React.Fragment>
                      {displayedAmount(
                        item?.prices[0].amount,
                        item?.prices[0].currency?.toUpperCase()
                      )}
                    </React.Fragment>
                  )}
                </AppTextBody>
              </View>
            )}
          </View>
        </View>
      </ClickableWrapper>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: moderateScale(16),
    alignContent: "center",
  },
  imageContainer: {},
  image: {
    height: horizontalScale(30),
    width: horizontalScale(30),
    borderRadius: verticalScale(10),
  },
  authorContainer: {},
  author: {
    fontSize: moderateScale(SIZES.base - 2),
  },
  metadataContainer: {
    width: horizontalScale(203),
    justifyContent: "space-between",
    paddingRight: horizontalScale(15),
  },
  titleContainer: {},
  title: {
    fontSize: moderateScale(SIZES.h3),
  },
  detailsContainer: {},
  date: {},
  price: {},
  eventImage: {
    height: horizontalScale(90),
    width: verticalScale(128),
    borderRadius: verticalScale(7),
  },

  eventDescriptionContainer: {
    paddingTop: verticalScale(20),
  },
  eventTitle: {
    fontSize: moderateScale(SIZES.base),
    color: defaultTheme.PRIMARY_TEXT_COLOR,
  },
  eventMetadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(18),
  },
  metadatItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  eventAuthorContainer: {
    marginVertical: verticalScale(2),
  },
  authorName: {
    fontSize: moderateScale(SIZES.base - 2),
    fontWeight: "700",
  },
  eventMetadataText: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontSize: moderateScale(SIZES.base - 4),
    fontWeight: "700",
  },
});
