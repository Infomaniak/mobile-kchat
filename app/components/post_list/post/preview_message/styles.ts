// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {blendColors, changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

export const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    previewMessageContainer: {
        borderWidth: 1,
        borderColor: blendColors(theme.centerChannelBg, theme.centerChannelColor, 0.3),
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        padding: 11,
        borderRadius: 4,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    displayNameHeader: {
        marginRight: 5,
    },
    channelDisplayName: {
        color: changeOpacity(theme.centerChannelColor, 0.64),
        marginTop: 15,
    },
    message: {
        color: theme.centerChannelColor,
        ...typography('Body', 200),
        lineHeight: undefined,
    },
    profilePicture: {
        width: 30, height: 30, borderRadius: 50, marginRight: 8,
    },
    time: {
        color: changeOpacity(theme.centerChannelColor, 0.64),
        ...typography('Body', 25),
        marginBottom: 4,
    },
}));
