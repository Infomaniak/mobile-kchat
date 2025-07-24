// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {BaseOption} from '@components/common_post_options';
import FormattedText from '@components/formatted_text';
import {ITEM_HEIGHT} from '@components/option_item';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import NetworkManager from '@managers/network_manager';
import BottomSheet from '@screens/bottom_sheet';
import {dismissBottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint, getCurrentMomentForTimezone} from '@utils/helpers';
import {isSystemMessage} from '@utils/post';
import {typography} from '@utils/typography';

import type PostModel from '@typings/database/models/servers/post';

const POST_OPTIONS_BUTTON = 'close-post-options';

type Props = {
    post: PostModel;
    componentId: string;
    postId: string;
    postpone: boolean;
};

const IKReminder = ({post, postId, postpone, componentId}: Props) => {
    const serverUrl = useServerUrl();
    const {bottom} = useSafeAreaInsets();
    const isTablet = useIsTablet();
    const theme = useTheme();
    const showCustom = false;
    const Scroll = useMemo(() => (isTablet ? ScrollView : BottomSheetScrollView), [isTablet]);

    const postReminderTimes = [
        {
            id: 'thirty_minutes',
            label: 'infomaniak.post_info.post_reminder.sub_menu.thirty_minutes',
            labelDefault: '30 mins',
        },
        {id: 'one_hour', label: 'infomaniak.post_info.post_reminder.sub_menu.one_hour', labelDefault: '1 hour'},
        {id: 'two_hours', label: 'infomaniak.post_info.post_reminder.sub_menu.two_hours', labelDefault: '2 hours'},
        {id: 'tomorrow', label: 'infomaniak.post_info.post_reminder.sub_menu.tomorrow', labelDefault: 'Tomorrow'},
        {id: 'monday', label: 'infomaniak.post_info.post_reminder.sub_menu.monday', labelDefault: 'Monday'},
    ];

    const close = () => {
        return dismissBottomSheet(Screens.INFOMANIAK_REMINDER);
    };

    useNavButtonPressed(POST_OPTIONS_BUTTON, componentId, close, []);

    let isSystemPost = true;
    if (post) {
        isSystemPost = isSystemMessage(post);
    }

    const snapPoints = useMemo(() => {
        const items: Array<string | number> = [1];
        const optionsCount = postReminderTimes.length + (showCustom ? 1 : 0);

        items.push(bottomSheetSnapPoint(optionsCount, ITEM_HEIGHT, bottom) + 50);
        return items;
    }, [isSystemPost, bottom]);

    const onPress = (itemId: String) => {
        const currentDate = getCurrentMomentForTimezone(null);
        let endTime = currentDate;
        switch (itemId) {
            case 'thirty_minutes':
                endTime = currentDate.add(30, 'minutes');
                break;
            case 'one_hour':
                endTime = currentDate.add(1, 'hour');
                break;
            case 'two_hours':
                endTime = currentDate.add(2, 'hours');
                break;
            case 'tomorrow':
                endTime = currentDate.add(1, 'day').hours(9).minutes(0).seconds(0);
                break;
            case 'monday':
                endTime = currentDate.startOf('isoWeek').add(1, 'week').hours(9).minutes(0).seconds(0);
                break;
        }
        if (postpone) {
            addPostponeReminder(endTime.unix());
        } else {
            addPostReminder(endTime.unix());
        }

        close();
    };

    const addPostReminder = async (timestamp: number) => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            await client.addPostReminder(post.id, timestamp);
        } catch (e) {
            // do nothing
        }
        return {};
    };

    const addPostponeReminder = async (timestamp: number) => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const reschedule = true;
            const reminderPostId = post.id;

            await client.addPostReminder(postId, timestamp, reschedule, reminderPostId);
        } catch (e) {
            // do nothing
        }
        return {};
    };

    const renderContent = () => {
        return (
            <Scroll bounces={false}>
                <FormattedText
                    style={{...typography('Heading', 600, 'SemiBold'), color: theme.centerChannelColor}}
                    id='infomaniak.post_info.post_reminder.menu'
                    defaultMessage='Remind'
                />
                {postReminderTimes.map((item) => (
                    <BaseOption
                        key={item.id}
                        i18nId={item.label}
                        defaultMessage={item.labelDefault}
                        onPress={() => onPress(item.id)}
                        iconName=''
                        testID={item.id}
                    />))
                }
            </Scroll>
        );
    };

    return (
        <BottomSheet
            renderContent={renderContent}
            closeButtonId={POST_OPTIONS_BUTTON}
            componentId={Screens.INFOMANIAK_REMINDER}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            testID='post_options'
        />
    );
};

export default IKReminder;
