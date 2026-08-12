// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {DeviceEventEmitter, Text, View} from 'react-native';

import {BaseOption} from '@components/common_post_options';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import BottomSheet from '@screens/bottom_sheet';
import {dismissBottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {typography} from '@utils/typography';

const CLOSE_BUTTON_ID = 'close-feedback-options';

type Props = {
    componentId: string;
    options: Array<{text: string; value: string}>;
    selected: string;
    eventName: string;
    title: string;
};

const FeedbackOptions = ({options, selected, eventName, title}: Props) => {
    const theme = useTheme();

    const handleSelect = (value: string) => {
        DeviceEventEmitter.emit(eventName, value);
        dismissBottomSheet();
    };

    const snapPoints = [1, bottomSheetSnapPoint(options.length, 48) + 60];

    return (
        <BottomSheet
            renderContent={() => (
                <BottomSheetScrollView bounces={false}>
                    <Text
                        style={{...typography('Heading', 600, 'SemiBold'), color: theme.centerChannelColor}}
                    >
                        {title}
                    </Text>
                    <View style={{marginTop: 8}}>
                        {options.map((option) => (
                            <BaseOption
                                key={option.value}
                                message={{id: `feedback_selector.option.${option.value}`, defaultMessage: option.text}}
                                onPress={() => handleSelect(option.value)}
                                testID={`feedback_selector.option.${option.value}`}
                                iconName={option.value === selected ? 'check' : undefined}
                            />
                        ))}
                    </View>
                </BottomSheetScrollView>
            )}
            closeButtonId={CLOSE_BUTTON_ID}
            componentId={Screens.FEEDBACK_OPTIONS}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            testID='feedback_options'
        />
    );
};

export default FeedbackOptions;
