// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Clipboard from '@react-native-clipboard/clipboard';
import React, {useCallback} from 'react';
import {Platform, Pressable, Text} from 'react-native';

import {SNACK_BAR_TYPE} from '@constants/snack_bar';
import {ANDROID_33, OS_VERSION} from '@constants/versions';
import {useTheme} from '@context/theme';
import {showSnackBar} from '@utils/snack_bar';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

type Props = {
    description: string;
    testID?: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    email: {
        color: theme.linkColor,
        overflow: 'hidden',
        flex: 2,
        ...typography('Body', 200),
    },
    button: {
        flex: 2,
    },
}));

const UserProfileEmail = ({description, testID}: Props) => {
    const styles = getStyleSheet(useTheme());

    const copyEmail = useCallback(() => {
        Clipboard.setString(description);
        if ((Platform.OS === OS_VERSION.ANDROID && Number(Platform.Version) < ANDROID_33) || Platform.OS === OS_VERSION.IOS) {
            showSnackBar({barType: SNACK_BAR_TYPE.TEXT_COPIED});
        }
    }, [description]);

    return (
        <Pressable
            onPress={copyEmail}
            style={({pressed}) => [styles.button, pressed && {opacity: 0.72}]}
        >
            <Text
                style={styles.email}
                numberOfLines={1}
                testID={`${testID}.email`}
            >
                {description}
            </Text>
        </Pressable>
    );
};

export default UserProfileEmail;
