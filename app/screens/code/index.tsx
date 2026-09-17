// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from 'expo-router';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View, type TextStyle} from 'react-native';

import NavigationButton from '@components/navigation_button';
import SyntaxHiglight from '@components/syntax_highlight';
import {Screens} from '@constants';
import {SNACK_BAR_TYPE} from '@constants/snack_bar';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {navigateBack} from '@screens/navigation';
import {showSnackBar} from '@utils/snack_bar';

export type CodeScreenProps = {
    code: string;
    language: string;
    textStyle: TextStyle;
}

const styles = StyleSheet.create({
    flex: {flex: 1},
});

const Code = ({code, language, textStyle}: CodeScreenProps) => {
    const theme = useTheme();
    const navigation = useNavigation();
    useAndroidHardwareBackHandler(Screens.CODE, navigateBack);

    const copyToClipboard = useCallback(() => {
        if (!code) {
            return;
        }

        Clipboard.setString(code);
        showSnackBar({barType: SNACK_BAR_TYPE.CODE_COPIED, sourceScreen: Screens.CODE});
    }, [code]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <NavigationButton
                    onPress={copyToClipboard}
                    iconName='content-copy'
                    iconSize={24}
                    color={theme.centerChannelColor}
                    testID='code.copy.button'
                />
            ),
        });
    }, [navigation, copyToClipboard, theme.centerChannelColor]);

    return (
        <View style={styles.flex}>
            <SyntaxHiglight
                code={code}
                language={language}
                selectable={false}
                textStyle={textStyle}
            />
        </View>
    );
};

export default Code;
