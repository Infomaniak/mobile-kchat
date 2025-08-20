// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

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
        fontSize: 14,
    },
    text: {
        color: theme.centerChannelColor,
        lineHeight: 20,
    },
    transcriptContainer: {
        flexDirection: 'row',
        margin: 4,
    },
    parentView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
}));
