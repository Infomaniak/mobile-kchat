// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, Text, TouchableOpacity, View} from 'react-native';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import GroupIcon from '@screens/group_members/group_icon';
import {openAsBottomSheet} from '@screens/navigation';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

export type GroupInfo = {
    id: string;
    displayName: string;
    name: string;
    memberCount: number;
}

type Props = {
    group: GroupInfo;
}

const CLOSE_BUTTON_ID = 'close-group-members';

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 40,
        paddingTop: 4,
        paddingBottom: 8,
        marginVertical: 8,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    displayName: {
        flexShrink: 1,
        color: theme.centerChannelColor,
        ...typography('Body', 200),
    },
    username: {
        color: changeOpacity(theme.centerChannelColor, 0.64),
        ...typography('Body', 100),
    },
    badge: {
        backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
        borderRadius: 4,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        paddingRight: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: changeOpacity(theme.centerChannelColor, 0.64),
        ...typography('Body', 75, 'SemiBold'),
    },
}));

const GroupRow = ({group}: Props) => {
    const theme = useTheme();
    const intl = useIntl();
    const styles = getStyleSheet(theme);

    const handlePress = useCallback(() => {
        const title = group.displayName;

        Keyboard.dismiss();
        openAsBottomSheet({
            screen: Screens.GROUP_MEMBERS,
            title,
            theme,
            closeButtonId: CLOSE_BUTTON_ID,
            props: {groupId: group.id},
        });
    }, [group.id, group.displayName, theme]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.container}
            accessibilityLabel={intl.formatMessage(
                {id: 'group_row.member_count', defaultMessage: '{count} members'},
                {count: group.memberCount},
            )}
        >
            <View style={styles.icon}>
                <GroupIcon size={24}/>
            </View>
            <View style={styles.textContainer}>
                <Text
                    style={styles.displayName}
                    numberOfLines={1}
                >
                    {group.displayName}
                </Text>
                {Boolean(group.name) && (
                    <Text
                        style={styles.username}
                        numberOfLines={1}
                    >
                        {`@${group.name}`}
                    </Text>
                )}
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {group.memberCount}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GroupRow;
