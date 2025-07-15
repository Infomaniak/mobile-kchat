// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {useCallback, useMemo, useState} from 'react';
import {Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {BaseOption} from '@components/common_post_options';
import FormattedText from '@components/formatted_text';
import {ITEM_HEIGHT} from '@components/option_item';
import UpgradeButton from '@components/upgrade/ik_upgrade';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import {useGetUsageDeltas} from '@hooks/usage';
import NetworkManager from '@managers/network_manager';
import BottomSheet from '@screens/bottom_sheet';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {isSystemMessage} from '@utils/post';
import {typography} from '@utils/typography';

import ClearAfterMenuItem from '../custom_status_clear_after/components/clear_after_menu_item';

import type {PostReminderTimestamp} from '@app/client/rest/ikcustomactions';
import type {CloudUsageModel, LimitModel} from '@app/database/models/server';
import type PostModel from '@typings/database/models/servers/post';
import type UserModel from '@typings/database/models/servers/user';

const POST_OPTIONS_BUTTON = 'close-post-options';

type Props = {
    post: PostModel;
    componentId: string;
    postId: string;
    postpone: boolean;
    currentUser?: UserModel;
    limits: LimitModel;
    usage: CloudUsageModel;
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

const IKReminder = ({post, postId, postpone, componentId, currentUser, limits, usage}: Props) => {
    const serverUrl = useServerUrl();
    const {bottom} = useSafeAreaInsets();
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

    const {reminder_custom_date: reminderCustomDate} = useGetUsageDeltas(usage, limits);

    useNavButtonPressed(POST_OPTIONS_BUTTON, componentId, close, []);

    let isSystemPost = true;
    if (post) {
        isSystemPost = isSystemMessage(post);
    }

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
    }, [isSystemPost, bottom, showCustomPicker]);

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
            await client.addPostReminder(post.id, timestamp);
        } catch (e) {
            // do nothing
        }
        return {};
    };

    const addPostponeReminder = async (timestamp: PostReminderTimestamp) => {
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

    const onPressEvolve = useCallback(async () => {
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
                            i18nId={item.label}
                            defaultMessage={item.labelDefault}
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
            componentId={Screens.INFOMANIAK_REMINDER}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            testID='post_options'
        />
    );
};

export default IKReminder;
