// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';
import {DeviceEventEmitter, Pressable, Text} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {usePreventDoubleTap} from '@hooks/utils';
import {openAsBottomSheet} from '@screens/navigation';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        borderWidth: 1,
        borderColor: changeOpacity(theme.centerChannelColor, 0.1),
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: changeOpacity(theme.centerChannelBg, 0.9),
    },
    text: {
        ...typography('Body', 200),
        color: theme.centerChannelColor,
    },
    placeholder: {
        ...typography('Body', 200),
        color: changeOpacity(theme.centerChannelColor, 0.5),
    },
}));

type Option = {
    text: string;
    value: string;
};

type Props = {
    options: readonly Option[];
    selected: string;
    onSelected: (value: string) => void;
}

const FeedbackSelector = ({options, selected, onSelected}: Props) => {
    const intl = useIntl();
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const selectedText = useMemo(() => {
        return options.find((opt) => opt.value === selected)?.text || '';
    }, [options, selected]);

    const handleOpen = usePreventDoubleTap(() => {
        const eventName = `feedback-selector-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const listener = DeviceEventEmitter.addListener(eventName, (value: string) => {
            listener.remove();
            onSelected(value);
        });

        openAsBottomSheet({
            closeButtonId: 'close-feedback-options',
            screen: Screens.FEEDBACK_OPTIONS,
            theme,
            title: '',
            props: {
                options: options.map((o) => ({text: o.text, value: o.value})),
                selected,
                eventName,
                title: intl.formatMessage({id: 'mobile.action_menu.select', defaultMessage: 'Select an option'}),
            },
        });
    });

    return (
        <Pressable
            style={styles.container}
            onPress={handleOpen}
        >
            <Text style={selectedText ? styles.text : styles.placeholder}>
                {selectedText || intl.formatMessage({id: 'mobile.action_menu.select', defaultMessage: 'Select an option'})}
            </Text>
            <CompassIcon
                name='chevron-down'
                size={24}
                color={changeOpacity(theme.centerChannelColor, 0.5)}
            />
        </Pressable>
    );
};

export default FeedbackSelector;
