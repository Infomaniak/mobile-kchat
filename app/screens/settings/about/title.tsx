// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Text} from 'react-native';

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

type TitleProps = {
    config: ClientConfig;
}
const Title = ({config}: TitleProps) => {
    const theme = useTheme();
    const style = getStyleSheet(theme);

    return (
        <>
            <Text
                style={[style.title, style.spacerTop]}
                testID='about.site_name'
            >
                {`${config.SiteName} `}
            </Text>
        </>

    );
};

export default Title;
