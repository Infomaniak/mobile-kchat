// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {useCallback, useMemo, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CompassIcon from '@app/components/compass_icon';
import {useTheme} from '@app/context/theme';
import {quotaGate, useNextPlan} from '@app/hooks/plans';
import {useGetUsageDeltas} from '@app/hooks/usage';
import DateTimeSelector from '@app/screens/custom_status_clear_after/components/date_time_selector';
import {getTimezone} from '@app/utils/user';
import {BaseOption} from '@components/common_post_options';
import CustomStatusExpiry from '@components/custom_status/custom_status_expiry';
import FormattedText from '@components/formatted_text';
import {ITEM_HEIGHT} from '@components/option_item';
import UpgradeButton from '@components/upgrade/ik_upgrade';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useIsTablet} from '@hooks/device';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import NetworkManager from '@managers/network_manager';
import BottomSheet from '@screens/bottom_sheet';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint, getCurrentMomentForTimezone} from '@utils/helpers';
import {isSystemMessage} from '@utils/post';
import {typography} from '@utils/typography';

import ClearAfterMenuItem, {getStyleSheet} from '../custom_status_clear_after/components/clear_after_menu_item';

import type PostModel from '@typings/database/models/servers/post';

const POST_OPTIONS_BUTTON = 'close-post-options';

type Props = {
    post: PostModel;
    componentId: string;
    postId: string;
    postpone: boolean;
    currentUser?: any;
};

const IKReminder = ({post, postId, postpone, componentId, currentUser}: Props) => {
    const serverUrl = useServerUrl();
    const {bottom} = useSafeAreaInsets();
    const isTablet = useIsTablet();
    const theme = useTheme();
    const Scroll = useMemo(() => (isTablet ? ScrollView : BottomSheetScrollView), [isTablet]);
    const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);
    const [expiresAt, setExpiresAt] = useState<string>('');
    const [customDate, setCustomDate] = useState(new Date());

    const showExpiryTime = Boolean(expiresAt);

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
        {id: 'custom', label: 'infomaniak.post_info.post_reminder.sub_menu.custom', labelDefault: 'Custom'},
    ];

    const close = async () => {
        await dismissBottomSheet(Screens.INFOMANIAK_REMINDER);
    };

    const currentPack = useNextPlan();
    const {reminder_custom_date: reminderCustomDate} = useGetUsageDeltas() || {};

    useNavButtonPressed(POST_OPTIONS_BUTTON, componentId, close, []);

    let isSystemPost = true;
    if (post) {
        isSystemPost = isSystemMessage(post);
    }

    const handleItemClick = useCallback((duration, expiresAt) => {
        setExpiresAt(expiresAt);
    }, []);

    const snapPoints = useMemo(() => {
        const items: Array<string | number> = [1];
        const optionsCount = postReminderTimes.length;
        let space = 50;
        if (showCustomPicker) {
            space = 400;
        }
        items.push(bottomSheetSnapPoint(optionsCount, ITEM_HEIGHT, bottom) + space);
        return items;
    }, [isSystemPost, bottom, showCustomPicker]);

    const handleCustomValidate = () => {
        if (!expiresAt) {
            return;
        }
        const unixTimestamp = moment(expiresAt).unix();
        addPostReminder(unixTimestamp);
        setShowCustomPicker(false);
    };

    const onPress = async (itemId: String) => {
        const currentDate = getCurrentMomentForTimezone(null);
        let endTime = currentDate;
        switch (itemId) {
            case 'thirty_minutes':
                endTime = currentDate.add(1, 'seconds');
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
            case 'custom':
                setShowCustomPicker(true);
                return;
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

    const onPressT = useCallback(async () => {
        await dismissBottomSheet(Screens.INFOMANIAK_REMINDER);

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_EVOLVE,
            theme,
            title: '',
            props: {
                post,
            },
        });
    }, [Screens.INFOMANIAK_REMINDER, post]);
    console.log('🚀 ~ renderContent ~ expiresAt:', expiresAt);
    const styles = {
        customButton: {
            backgroundColor: '#2563eb', // bleu (ex: blue-600 Tailwind)
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center', // centre horizontalement
            marginTop: 16,
        },
        customButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 16,
            textAlign: 'center',
        },
    };
    const renderContent = () => {
        const {isQuotaExceeded, withQuotaCheck} = quotaGate(reminderCustomDate, currentPack);

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
                        onPress={(false) ? () => onPressT() : () => onPress(item.id)}

                        // onPress={(item.id === 'custom' && isQuotaExceeded) ? () => onPressT() : () => onPress(item.id)}
                        iconName=''
                        testID={item.id}
                        rightComponent={(false) ? <UpgradeButton/> : undefined}

                        // rightComponent={(item.id === 'custom' && isQuotaExceeded) ? <UpgradeButton/> : undefined}
                    />))
                }
                {showCustomPicker && (
                    <View>
                        <ClearAfterMenuItem
                            currentUser={currentUser}
                            duration={'po'}
                            expiryTime={expiresAt}
                            handleItemClick={handleItemClick}
                            isSelected={false}
                            separator={false}
                            showDateTimePicker={true}
                            showExpiryTime={showExpiryTime}
                            showDate={true}
                        />
                        <TouchableOpacity
                            style={styles.customButton}
                            onPress={handleCustomValidate}
                        >
                            <FormattedText
                                defaultMessage={'Sauvegarder le rappel'}
                                id='ksuite_free_baer'
                                style={styles.customButtonText}
                            />
                        </TouchableOpacity>
                    </View>)
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
