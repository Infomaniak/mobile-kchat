// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {Text, View, type StyleProp, type TextStyle, type ViewStyle} from 'react-native';

import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {getInitialsFromName} from '@utils/user';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        text: {
            color: theme.centerChannelColor,
            textTransform: 'uppercase',
        },
    };
});

type Props = {
    name: string;
    size: number;
    backgroundColor?: string;
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
    textColor?: string;
    theme?: Theme;
    testID?: string;
}

export default function InitialsFallback({
    name,
    size,
    backgroundColor,
    children,
    style,
    textColor,
    theme: themeProp,
    testID,
}: Props) {
    const themeFromContext = useTheme();
    const theme = themeProp || themeFromContext;
    const styles = getStyleSheet(theme);

    const textStyle = useMemo((): StyleProp<TextStyle> => {
        const fontSize = size * 0.4;
        const textTypography = typography('Heading', size < 32 ? 200 : 400, 'SemiBold');
        textTypography.fontFamily = 'Metropolis-SemiBold';

        return [
            styles.text,
            textTypography,
            {fontSize, lineHeight: fontSize * 1.2},
            Boolean(textColor) && {color: textColor},
            style,
        ];
    }, [size, styles, textColor, style]);

    const initials = getInitialsFromName(name);

    const content = (
        <Text
            style={textStyle}
            testID={testID}
        >
            {initials}
        </Text>
    );

    if (backgroundColor) {
        const containerStyle: StyleProp<ViewStyle> = {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
        };
        return (
            <View style={containerStyle}>
                {content}
                {children}
            </View>
        );
    }

    return content;
}
