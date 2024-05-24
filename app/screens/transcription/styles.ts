// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {changeOpacity, makeStyleSheetFromTheme} from '@app/utils/theme';
import {typography} from '@app/utils/typography';

export const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    title: {
        color: theme.centerChannelColor,
        padding: 10,
        fontSize: 15,
        fontWeight: 'bold',
    },
    separator: {
        height: 0.5,
        backgroundColor: changeOpacity(theme.centerChannelColor, 0.64),
        marginBottom: 20,
    },
    time: {
        color: changeOpacity(theme.centerChannelColor, 0.64),
        ...typography('Body', 25),
        marginBottom: 4,
        fontSize: 14,
    },
    text: {
        flexShrink: 1,
    },
    transcriptContainer: {
        flexDirection: 'row',
    },
}));
