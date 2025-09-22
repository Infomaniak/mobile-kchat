// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment';
import React, {useCallback, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, SafeAreaView, View} from 'react-native';

import {updateScheduledPost} from '@actions/remote/scheduled_post';
import DateTimeSelector from '@components/data_time_selector';
import Loading from '@components/loading';
import UpgradeButton from '@components/upgrade/ik_upgrade';
import {Screens} from '@constants';
import {MESSAGE_TYPE, SNACK_BAR_TYPE} from '@constants/snack_bar';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import {quotaGate} from '@hooks/plans';
import {useGetUsageDeltas} from '@hooks/usage';
import {usePreventDoubleTap} from '@hooks/utils';
import {buildNavigationButton, dismissModal, openAsBottomSheet, setButtons} from '@screens/navigation';
import PickerOption from '@screens/post_priority_picker/components/picker_option';
import {logDebug} from '@utils/log';
import {showSnackBar} from '@utils/snack_bar';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {getFormattedTime} from '@utils/time';
import {getTimezone} from '@utils/user';

import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type ScheduledPostModel from '@typings/database/models/servers/scheduled_post';
import type {AvailableScreens} from '@typings/screens/navigation';
import type {Moment} from 'moment-timezone';

type Props = {
    currentUserTimezone?: UserTimezone | null;
    componentId: AvailableScreens;
    closeButtonId: string;
    draft: ScheduledPostModel;
    limits: LimitModel;
    usage: CloudUsageModel;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        flex: 1,
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsContainer: {
        paddingTop: 12,
    },
    optionsSeparator: {
        backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
        height: 1,
    },
}));

const optionKeysOptionMonday = 'scheduledPostOptionMonday';
const optionKeyOptionTomorrow = 'scheduledPostOptionTomorrow';
const optionKeyOptionNextMonday = 'scheduledPostOptionNextMonday';
const optionKeyOptionCustom = 'scheduledPostOptionCustom';

const RIGHT_BUTTON = buildNavigationButton('reschedule-draft', 'reschedule_draft.save.button');

const RescheduledDraft: React.FC<Props> = ({
    currentUserTimezone,
    componentId,
    closeButtonId,
    draft,
    usage,
    limits,
}) => {
    const styles = getStyleSheet(useTheme());
    const theme = useTheme();
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedOption, setSelectedOptions] = useState<string>();
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const selectedTime = useRef<string | null>(null);
    const userTimezone = getTimezone(currentUserTimezone);
    const {scheduled_draft_custom_date: scheduledDraftCustomDate} = useGetUsageDeltas(usage, limits);
    const {isQuotaExceeded} = quotaGate(scheduledDraftCustomDate);

    const toggleSaveButton = useCallback((enabled = false) => {
        setButtons(componentId, {
            rightButtons: [{
                ...RIGHT_BUTTON,
                color: theme.sidebarHeaderTextColor,
                disabledColor: changeOpacity(theme.sidebarHeaderTextColor, 0.32),
                text: intl.formatMessage({id: 'edit_post.save', defaultMessage: 'Save'}),
                enabled,
            }],
        });
    }, [componentId, intl, theme]);

    const onClose = useCallback(() => {
        Keyboard.dismiss();
        dismissModal({componentId});
    }, [componentId]);

    const handleUIUpdates = useCallback((res: {error?: unknown}) => {
        if (res.error) {
            setIsUpdating(false);
            const errorMessage = intl.formatMessage({id: 'mobile.scheduled_post.update.error', defaultMessage: 'There was a problem updating this post message. Please try again.'});
            showSnackBar({
                barType: SNACK_BAR_TYPE.RESCHEDULED_POST,
                customMessage: errorMessage,
                type: MESSAGE_TYPE.ERROR,
            });
        } else {
            onClose();
        }
    }, [intl, onClose]);

    const onSavePostMessage = usePreventDoubleTap(useCallback(async () => {
        setIsUpdating(true);
        toggleSaveButton(false);
        if (!selectedTime.current) {
            logDebug('ScheduledPostOptions', 'No time selected');
            setIsUpdating(false);
            const errorMessage = intl.formatMessage({id: 'mobile.scheduled_post.error', defaultMessage: 'No time selected'});
            showSnackBar({
                barType: SNACK_BAR_TYPE.RESCHEDULED_POST,
                customMessage: errorMessage,
                type: MESSAGE_TYPE.ERROR,
            });
            return;
        }

        const res = await updateScheduledPost(serverUrl, draft, parseInt(selectedTime.current, 10));
        handleUIUpdates(res);
    }, [draft, handleUIUpdates, intl, selectedTime, serverUrl, toggleSaveButton]));

    useNavButtonPressed(closeButtonId, componentId, onClose, []);
    useNavButtonPressed(RIGHT_BUTTON.id, componentId, onSavePostMessage, []);
    useAndroidHardwareBackHandler(componentId, onClose);

    const onPressEvolve = useCallback(async () => {
        onClose();

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_EVOLVE,
            theme,
            title: '',
        });
    }, [onClose, theme]);

    const now = moment().tz(userTimezone);

    const handleSelectOption = useCallback((optionKey: string) => {
        setSelectedOptions(optionKey);
        setShowDateTimePicker(optionKey === optionKeyOptionCustom);

        let selectedTimeValue: Moment | undefined;

        switch (optionKey) {
            case optionKeyOptionNextMonday:
            case optionKeysOptionMonday: {
                selectedTimeValue = now.clone().isoWeekday(1).add(1, 'week').startOf('day').hour(9).minute(0);
                break;
            }
            case optionKeyOptionTomorrow: {
                selectedTimeValue = now.clone().add(1, 'day').startOf('day').hour(9).minute(0);
                break;
            }
            default:
                selectedTime.current = null;
                toggleSaveButton(false);
                return;
        }

        if (selectedTimeValue) {
            const newSelectedTime = selectedTimeValue.valueOf().toString();
            selectedTime.current = newSelectedTime;
            toggleSaveButton(parseInt(newSelectedTime, 10) !== draft.scheduledAt);
        }
    }, [draft.scheduledAt, now, toggleSaveButton]);

    const handleCustomTimeChange = useCallback((updatedSelectedTime: Moment) => {
        const newSelectedTime = updatedSelectedTime.valueOf().toString();
        selectedTime.current = newSelectedTime;
        toggleSaveButton(parseInt(newSelectedTime, 10) !== draft.scheduledAt);
    }, [draft.scheduledAt, toggleSaveButton]);

    if (isUpdating) {
        return (
            <View style={styles.loader}>
                <Loading color={theme.buttonBg}/>
            </View>
        );
    }

    const nineAmTime = moment().
        tz(userTimezone).
        set({hour: 9, minute: 0, second: 0, millisecond: 0}).
        valueOf();
    const formattedTimeString = getFormattedTime(true, userTimezone, nineAmTime);

    const optionMonday = (
        <PickerOption
            key={optionKeysOptionMonday}
            label={intl.formatMessage({id: 'scheduled_post.picker.monday', defaultMessage: 'Monday at {9amTime}'}, {'9amTime': formattedTimeString})}
            action={handleSelectOption}
            value={optionKeysOptionMonday}
            selected={selectedOption === optionKeysOptionMonday}
        />
    );

    const optionTomorrow = (
        <PickerOption
            key={optionKeyOptionTomorrow}
            label={intl.formatMessage({id: 'scheduled_post.picker.tomorrow', defaultMessage: 'Tomorrow at {9amTime}'}, {'9amTime': formattedTimeString})}
            action={handleSelectOption}
            value={optionKeyOptionTomorrow}
            selected={selectedOption === optionKeyOptionTomorrow}
        />
    );

    const optionNextMonday = (
        <PickerOption
            key={optionKeyOptionNextMonday}
            label={intl.formatMessage({id: 'scheduled_post.picker.next_monday', defaultMessage: 'Next Monday at {9amTime}'}, {'9amTime': formattedTimeString})}
            action={handleSelectOption}
            value={optionKeyOptionNextMonday}
            selected={selectedOption === optionKeyOptionNextMonday}
        />
    );

    let options: React.ReactElement[] = [];

    switch (now.weekday()) {
        // Sunday
        case 7:
            options = [optionTomorrow];
            break;

            // Monday
        case 1:
            options = [optionTomorrow, optionNextMonday];
            break;

            // Friday and Saturday
        case 5:
        case 6:
            options = [optionMonday];
            break;

            // Tuesday to Thursday
        default:
            options = [optionTomorrow, optionMonday];
    }

    return (
        <SafeAreaView
            testID='edit_post.screen'
            style={styles.container}
        >
            <View style={styles.optionsContainer}>
                {options}
                <View style={styles.optionsSeparator}/>
                <PickerOption
                    key={optionKeyOptionCustom}
                    label={intl.formatMessage({id: 'scheduled_post.picker.custom', defaultMessage: 'Custom Time'})}
                    action={isQuotaExceeded ? onPressEvolve : handleSelectOption}
                    value={optionKeyOptionCustom}
                    selected={selectedOption === optionKeyOptionCustom}
                    rightComponent={isQuotaExceeded ? <UpgradeButton/> : undefined}
                />
                {showDateTimePicker && (
                    <DateTimeSelector
                        handleChange={handleCustomTimeChange}
                        theme={theme}
                        timezone={userTimezone}
                        showInitially='date'
                        showDateTimePickerButton={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default RescheduledDraft;
