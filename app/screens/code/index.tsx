// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from 'expo-router';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, type TextStyle} from 'react-native';
import {SafeAreaView, type Edge} from 'react-native-safe-area-context';

import NavigationButton from '@components/navigation_button';
import SyntaxHiglight from '@components/syntax_highlight';
import {SNACK_BAR_TYPE} from '@constants/snack_bar';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {popTopScreen} from '@screens/navigation';
import {showSnackBar} from '@utils/snack_bar';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId: AvailableScreens;
    code: string;
    language: string;
    textStyle: TextStyle;
}

const edges: Edge[] = ['left', 'right'];

const styles = StyleSheet.create({
    flex: {flex: 1},
});

const Code = ({code, componentId, language, textStyle}: Props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    useAndroidHardwareBackHandler(componentId, popTopScreen);

    const copyToClipboard = useCallback(() => {
        if (!code) {
            return;
        }

        Clipboard.setString(code);
        showSnackBar({barType: SNACK_BAR_TYPE.CODE_COPIED, sourceScreen: componentId});
    }, [code, componentId]);

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
        <SafeAreaView
            edges={edges}
            style={styles.flex}
            nativeID={`${componentId}.screen`}
        >
            <SyntaxHiglight
                code={code}
                language={language}
                selectable={false}
                textStyle={textStyle}
            />
        </SafeAreaView>
    );
};

export default Code;
