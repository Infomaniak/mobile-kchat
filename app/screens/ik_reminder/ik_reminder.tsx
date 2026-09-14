// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {useCallback, useMemo, useState} from 'react';
import {defineMessage} from 'react-intl';
import {Platform, ScrollView, TouchableOpacity, View} from 'react-native';

import {BaseOption} from '@components/common_post_options';
import FormattedText from '@components/formatted_text';
import {ITEM_HEIGHT} from '@components/option_item';
import UpgradeButton from '@components/upgrade/ik_upgrade';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {quotaGate} from '@hooks/plans';
import {useGetUsageDeltas} from '@hooks/usage';
import NetworkManager from '@managers/network_manager';
import BottomSheet from '@screens/bottom_sheet';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import ClearAfterMenuItem from '../custom_status_clear_after/components/clear_after_menu_item';

import type {PostReminderTimestamp} from '@client/rest/ikcustomactions';
import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const POST_OPTIONS_BUTTON = 'close-post-options';

type Props = {
    componentId?: AvailableScreens;
    currentUser?: UserModel;
    limits?: LimitModel | null;
    postId: string;
    postpone?: boolean;
    postponePostId?: string;
    usage?: CloudUsageModel | null;
};

const getStyleFromTheme = makeStyleSheetFromTheme(() => {
    return {
        customButton: {
            backgroundColor: '#2563eb',
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 16,
        },
        customButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 16,
            textAlign: 'center',
        },
    };
});

const IkPostReminder = {
    THIRTY_MINUTES: '30 minutes',
    ONE_HOUR: '1 hour',
    TWO_HOURS: '2 hours',
    TOMORROW: 'tomorrow',
    MONDAY: 'monday',
};

export type PredefinedTimestamp = typeof IkPostReminder[keyof typeof IkPostReminder];

const postReminderTimes = [
    {
        id: 'thirty_minutes',
        message: defineMessage({
            id: 'infomaniak.post_info.post_reminder.sub_menu.thirty_minutes',
            defaultMessage: '30 mins',
        }),
    },
    {
        id: 'one_hour',
        message: defineMessage({
            id: 'infomaniak.post_info.post_reminder.sub_menu.one_hour',
            defaultMessage: '1 hour',
        }),
    },
    {
        id: 'two_hours',
        message: defineMessage({
            id: 'infomaniak.post_info.post_reminder.sub_menu.two_hours',
            defaultMessage: '2 hours',
        }),
    },
    {
        id: 'tomorrow',
        message: defineMessage({
            id: 'infomaniak.post_info.post_reminder.sub_menu.tomorrow',
            defaultMessage: 'Tomorrow',
        }),
    },
    {
        id: 'monday',
        message: defineMessage({
            id: 'infomaniak.post_info.post_reminder.sub_menu.monday',
            defaultMessage: 'Monday',
        }),
    },
    {
        id: 'custom',
        message: defineMessage({
            id: 'infomaniak.post_info.post_reminder.sub_menu.custom',
            defaultMessage: 'Custom',
        }),
    },
];

const IKReminder = ({postId, postpone = false, postponePostId, currentUser, limits, usage}: Props) => {
    const serverUrl = useServerUrl();
    const isTablet = useIsTablet();
    const theme = useTheme();
    const styles = getStyleFromTheme(theme);
    const Scroll = useMemo(() => (isTablet ? ScrollView : BottomSheetScrollView), [isTablet]);
    const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);
    const [expiresAt, setExpiresAt] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [duration, setDuration] = useState<string>('');
    const isAndroid = Platform.OS === 'android';
    const showExpiryTime = Boolean(expiresAt);

    const close = async () => {
        await dismissBottomSheet();
    };

    const {reminder_custom_date: reminderCustomDate} = useGetUsageDeltas(usage, limits);

    const handleItemClick = useCallback((dur: string, expires: string) => {
        setExpiresAt(expires);
        setDuration(dur);
    }, []);

    const snapPoints = useMemo(() => {
        const items: Array<string | number> = [1];
        const optionsCount = postReminderTimes.length;
        let space = 50;
        if (showCustomPicker) {
            space = isAndroid ? -70 : 100;
        }
        items.push(bottomSheetSnapPoint(optionsCount, ITEM_HEIGHT) + space);
        return items;
    }, [showCustomPicker, isAndroid]);

    const handleCustomValidate = () => {
        if (!expiresAt) {
            return;
        }
        const unixTimestamp = moment.utc(expiresAt).unix();
        addPostReminder(unixTimestamp);
        setShowCustomPicker(false);
        close();
    };

    const onPress = async (itemId: String) => {
        let endTime: string = '';
        switch (itemId) {
            case 'thirty_minutes':
                endTime = IkPostReminder.THIRTY_MINUTES;
                break;
            case 'one_hour':
                endTime = IkPostReminder.ONE_HOUR;
                break;
            case 'two_hours':
                endTime = IkPostReminder.TWO_HOURS;
                break;
            case 'tomorrow':
                endTime = IkPostReminder.TOMORROW;
                break;
            case 'monday':
                endTime = IkPostReminder.MONDAY;
                break;
            case 'custom':
                setShowCustomPicker(true);
                return;
        }
        if (postpone) {
            addPostponeReminder(endTime);
        } else {
            addPostReminder(endTime);
        }

        close();
    };

    const addPostReminder = async (timestamp: PostReminderTimestamp) => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            await client.addPostReminder(postId, timestamp);
        } catch (e) {
            // do nothing
        }
        return {};
    };

    const addPostponeReminder = async (timestamp: PostReminderTimestamp) => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const reschedule = true;

            await client.addPostReminder(postponePostId ?? postId, timestamp, reschedule, postId);
        } catch (e) {
            // do nothing
        }
        return {};
    };

    const onPressEvolve = useCallback(async () => {
        await dismissBottomSheet();

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.IK_EVOLVE,
            theme,
            title: '',
            props: {
                postId,
            },
        });
    }, [postId, theme]);

    const renderContent = () => {
        const {isQuotaExceeded} = quotaGate(reminderCustomDate);

        return (
            <Scroll bounces={false}>
                <FormattedText
                    style={{...typography('Heading', 600, 'SemiBold'), color: theme.centerChannelColor}}
                    id='infomaniak.post_info.post_reminder.menu'
                    defaultMessage='Remind'
                />
                {!showCustomPicker && postReminderTimes.map((item) => {
                    const isCustom = item.id === 'custom';
                    const shouldUpgrade = isCustom && isQuotaExceeded;

                    return (
                        <BaseOption
                            key={item.id}
                            message={item.message}
                            onPress={shouldUpgrade ? onPressEvolve : () => onPress(item.id)}
                            iconName=''
                            testID={item.id}
                            rightComponent={shouldUpgrade ? <UpgradeButton/> : undefined}
                        />
                    );
                })}
                {showCustomPicker && (
                    <View>
                        <ClearAfterMenuItem
                            currentUser={currentUser}
                            duration={''}
                            expiryTime={expiresAt}
                            handleItemClick={handleItemClick}
                            isSelected={false}
                            separator={false}
                            showDateTimePicker={true}
                            showExpiryTime={showExpiryTime}
                            showDate={!isAndroid}
                            showCustomStatus={false}
                            showDateTimePickerButton={Boolean(isAndroid)}
                        />
                        <TouchableOpacity
                            style={styles.customButton}
                            onPress={handleCustomValidate}
                        >
                            <FormattedText
                                defaultMessage={'Set the reminder'}
                                id='infomaniak.post_info.custom_reminder'
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
            componentId={Screens.IK_REMINDER}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            testID='post_options'
        />
    );
};

export default IKReminder;
