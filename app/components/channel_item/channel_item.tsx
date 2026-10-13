// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import Badge from '@components/badge';
import ChannelIcon from '@components/channel_icon';
import {General} from '@constants';
import {HOME_PADDING} from '@constants/view';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {isDMorGM} from '@utils/channel';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {getUserIdFromChannelName} from '@utils/user';

import {ChannelBody} from './channel_body';

import type ChannelModel from '@typings/database/models/servers/channel';

type Props = {
    channel: ChannelModel | Channel;
    currentUserId: string;
    hasDraft: boolean;
    isActive: boolean;
    isMuted: boolean;
    membersCount: number;
    isUnread: boolean;
    mentionsCount: number;
    onPress: (channel: ChannelModel | Channel) => void;
    teamDisplayName?: string;
    testID?: string;
    isOnCenterBg?: boolean;
    showChannelName?: boolean;
    isOnHome?: boolean;
    shouldHighlightActive?: boolean;
    shouldHighlightState?: boolean;
}

export const ROW_HEIGHT = 40;
export const ROW_HEIGHT_WITH_TEAM = 58;

export const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    text: {
        color: changeOpacity(theme.sidebarText, 0.72),
    },
    highlight: {
        color: theme.sidebarUnreadText,
    },
    textOnCenterBg: {
        color: theme.centerChannelColor,
    },
    muted: {
        color: changeOpacity(theme.sidebarText, 0.32),
    },
    mutedOnCenterBg: {
        color: changeOpacity(theme.centerChannelColor, 0.32),
    },
    badge: {
        borderColor: theme.sidebarBg,
        marginLeft: 4,

        //Overwrite default badge styles
        position: undefined,
        top: undefined,
        left: undefined,
        alignSelf: undefined,
    },
    badgeOnCenterBg: {
        color: theme.buttonColor,
        backgroundColor: theme.buttonBg,
        borderColor: theme.centerChannelBg,
    },
    mutedBadge: {
        opacity: 0.32,
    },
    activeItem: {
        backgroundColor: changeOpacity(theme.sidebarTextActiveColor, 0.1),
        borderLeftColor: theme.sidebarTextActiveBorder,
        borderLeftWidth: 5,
    },
    textActive: {
        color: theme.sidebarText,
    },
    hasCall: {
        textAlign: 'right',
    },
    filler: {
        flex: 1,
    },
}));

export const textStyle = StyleSheet.create({
    bold: typography('Body', 200, 'SemiBold'),
    regular: typography('Body', 200, 'Regular'),
});

const ChannelItem = ({
    channel,
    currentUserId,
    hasDraft,
    isActive,
    isMuted,
    membersCount,
    isUnread,
    mentionsCount,
    onPress,
    teamDisplayName = '',
    testID,
    isOnCenterBg = false,
    showChannelName = false,
    isOnHome = false,
    shouldHighlightActive = false,
    shouldHighlightState = false,
}: Props) => {
    const {formatMessage} = useIntl();
    const theme = useTheme();
    const isTablet = useIsTablet();
    const styles = getStyleSheet(theme);

    const channelName = (showChannelName && !isDMorGM(channel)) ? channel.name : '';

    // The observables are always subscribed; the highlight booleans only gate the display
    // so contexts like autocomplete keep their previous rendering.
    const shownHasDraft = shouldHighlightState && hasDraft;
    const shownIsMuted = shouldHighlightState && isMuted;
    const shownMentionsCount = shouldHighlightState ? mentionsCount : 0;

    // Make it bolded if it has unreads or mentions
    const isBolded = shouldHighlightState && (isUnread || shownMentionsCount > 0);
    const showActive = isActive && shouldHighlightActive && isTablet;

    const teammateId = (channel.type === General.DM_CHANNEL) ? getUserIdFromChannelName(currentUserId, channel.name) : undefined;
    const isOwnDirectMessage = (channel.type === General.DM_CHANNEL) && currentUserId === teammateId;

    let displayName = 'displayName' in channel ? channel.displayName : channel.display_name;
    if (isOwnDirectMessage) {
        displayName = formatMessage({id: 'channel_header.directchannel.you', defaultMessage: '{displayName} (you)'}, {displayName});
    }

    const deleteAt = 'deleteAt' in channel ? channel.deleteAt : channel.delete_at;
    const channelItemTestId = `${testID}.${channel.name}`;

    const height = useMemo(() => {
        return (teamDisplayName && !isTablet) ? ROW_HEIGHT_WITH_TEAM : ROW_HEIGHT;
    }, [teamDisplayName, isTablet]);

    const handleOnPress = useCallback(() => {
        onPress(channel);
    }, [channel, onPress]);

    const textStyles = useMemo(() => [
        isBolded && !shownIsMuted ? textStyle.bold : textStyle.regular,
        styles.text,
        isBolded && styles.highlight,
        showActive ? styles.textActive : null,
        isOnCenterBg ? styles.textOnCenterBg : null,
        shownIsMuted && styles.muted,
        shownIsMuted && isOnCenterBg && styles.mutedOnCenterBg,
    ], [isBolded, styles, shownIsMuted, showActive, isOnCenterBg]);

    const containerStyle = useMemo(() => [
        styles.container,
        isOnHome && HOME_PADDING,
        showActive && styles.activeItem,
        showActive && isOnHome && {
            paddingLeft: HOME_PADDING.paddingLeft - styles.activeItem.borderLeftWidth,
        },
        {minHeight: height},
    ], [height, showActive, styles, isOnHome]);

    return (
        <TouchableOpacity onPress={handleOnPress}>
            <View
                style={containerStyle}
                testID={channelItemTestId}
            >
                <ChannelIcon
                    hasDraft={shownHasDraft}
                    isActive={isTablet && isActive && shouldHighlightActive}
                    isOnCenterBg={isOnCenterBg}
                    isUnread={isBolded}
                    isArchived={deleteAt > 0}
                    membersCount={membersCount}
                    name={channel.name}
                    shared={channel.shared}
                    size={24}
                    type={channel.type}
                    isMuted={shownIsMuted}
                    style={styles.icon}
                />
                <ChannelBody
                    displayName={displayName}
                    isMuted={shownIsMuted}
                    teamDisplayName={teamDisplayName}
                    teammateId={teammateId}
                    testId={channelItemTestId}
                    textStyles={textStyles}
                    channelName={channelName}
                />
                <View style={styles.filler}/>
                <Badge
                    visible={shownMentionsCount > 0}
                    value={shownMentionsCount}
                    style={[styles.badge, shownIsMuted && styles.mutedBadge, isOnCenterBg && styles.badgeOnCenterBg]}
                />
            </View>
        </TouchableOpacity>
    );
};

// Memoized so HOC re-renders carrying identical observable values don't re-render the item
export default React.memo(ChannelItem);
