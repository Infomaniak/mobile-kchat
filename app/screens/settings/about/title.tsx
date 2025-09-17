// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Text} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        title: {
            ...typography('Heading', 800, 'SemiBold'),
            color: theme.centerChannelColor,
            paddingHorizontal: 36,
        },
        spacerTop: {
            marginTop: 8,
        },
        spacerBottom: {
            marginBottom: 8,
        },
    };
});

const Title = () => {
    const theme = useTheme();
    const style = getStyleSheet(theme);
    const appTitle = DeviceInfo.getApplicationName();

    return (
        <>
            <Text
                style={[style.title, style.spacerTop]}
                testID='about.site_name'
            >
                {`${appTitle} `}
            </Text>
        </>

    );
};

export default Title;
