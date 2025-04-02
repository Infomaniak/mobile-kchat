// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {Text} from 'react-native';

import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

type TimeElapsedProps = {
    time: string;
};
export const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    time: {
        color: theme.centerChannelColor,
        marginLeft: 12,
        marginRight: 5,
    },
}));

const TimeElapsed = ({time = '00:00'}: TimeElapsedProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    return (
        <Text style={styles.time}>
            {time}
        </Text>
    );
};

export default TimeElapsed;
