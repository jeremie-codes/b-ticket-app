import { StyleSheet, View } from "react-native";
import { SIZES } from "src/constants/App";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "src/constants/Metric";
import { defaultTheme } from "src/themes";
import { AppIcon } from "src/components/ui/icons";
import { AppTextLeading } from "src/components/ui/texts/AppTextLeading";
import { AppTextBody } from "src/components/ui/texts/AppTextBody";
import { ClickableWrapper } from "../ClickableWrapper";
import { EventType } from "src/types/event";
import React from "react";
import { useLoadImage } from "src/hooks/useLoadImage";
import { displayedAmount } from "src/utils/Currency";
import { formatDateFr } from "src/utils/Date";
import { EventImage } from "src/components/events/EventImage";

export const RenderEventItem = ({
  item,
  onPress,
}: {
  item: EventType;
  onPress?: () => void;
}) => {
  const { filePath } = useLoadImage(item, 500);
  const { filePath: thumbnailSource } = useLoadImage(item, 100);
  return (
    <React.Fragment>
      <ClickableWrapper onPress={onPress} style={styles.eventContainer}>
        <EventImage
          style={styles.eventImage}
          fileNameUrl={filePath!}
          thumbnailSource={thumbnailSource!}
        />

        <View style={styles.eventDescriptionContainer}>
          <View>
            <AppTextLeading numberOfLines={2} style={styles.eventTitle}>
              {item.title}
            </AppTextLeading>
          </View>
          <View style={styles.eventAuthorContainer}>
            <AppTextBody numberOfLines={1} style={styles.authorName}>
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
  eventDescriptionContainer: {
    width: verticalScale(300),
    paddingTop: verticalScale(12),
  },
  eventTitle: {
    fontSize: moderateScale(SIZES.h4 + 2),
    lineHeight: moderateScale(25),
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
    marginBottom: verticalScale(10),
  },
  authorName: {
    fontSize: moderateScale(SIZES.base - 2),
    fontWeight: "700",
  },
  eventMetadataText: {
    color: defaultTheme.PRIMARY_TEXT_COLOR,
    fontSize: moderateScale(SIZES.base - 2),
    fontWeight: "700",
  },

  eventContainer: {
    marginBottom: verticalScale(25),
  },
  eventImage: {
    height: horizontalScale(200),
    width: verticalScale(300),
    borderRadius: verticalScale(10),
  },
});
