// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

import PlaybackControls from './playback_controls';

const getStyleSheet = makeStyleSheetFromTheme(() => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
    },
}));

const LocalPlayBack = () => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    return (
        <View style={styles.container}>
            <PlaybackControls/>
        </View>
    );
};

export default LocalPlayBack;
