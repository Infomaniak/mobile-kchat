// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {type LayoutChangeEvent, type StyleProp, type TextStyle, View, type ViewStyle, Platform, Switch} from 'react-native';

import FormattedText from '@components/formatted_text';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {MessageDescriptor} from 'react-intl';

type SectionText = {
    id: string;
    defaultMessage: string;
    values?: MessageDescriptor;
}

type SettingBlockProps = {
    children: React.ReactNode;
    containerStyles?: StyleProp<ViewStyle>;
    disableFooter?: boolean;
    disableHeader?: boolean;
    footerStyles?: StyleProp<TextStyle>;
    footerText?: SectionText;
    headerStyles?: StyleProp<TextStyle>;
    headerText?: SectionText;
    onLayout?: (event: LayoutChangeEvent) => void;
    addButton?: boolean;
    toggleSwitch?: () => void;
    isSwitchOn?: boolean;
};

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            marginBottom: 30,
        },
        contentContainerStyle: {
            marginBottom: 0,
        },
        button: {
            marginRight: 10,
        },
        header: {
            color: theme.centerChannelColor,
            ...typography('Heading', 300, 'SemiBold'),
            marginBottom: 8,
            marginLeft: 20,
            marginTop: 12,
            marginRight: 15,
            flex: 1,
        },
        footer: {
            marginTop: 10,
            marginHorizontal: 15,
            fontSize: 12,
            color: changeOpacity(theme.centerChannelColor, 0.5),
        },
        flexRow: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        optionLabelTextStyle: {
            color: theme.centerChannelColor,
            ...typography('Body', 200, 'Regular'),
            marginBottom: 4,
        },
        optionDescriptionTextStyle: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 75, 'Regular'),
        },
    };
});

const SettingBlock = ({
    children, containerStyles, disableFooter, disableHeader,
    footerStyles, footerText, headerStyles, headerText, onLayout, isSwitchOn, addButton, toggleSwitch,
}: SettingBlockProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const trackColor = Platform.select({
        ios: {true: theme.buttonBg, false: changeOpacity(theme.centerChannelColor, 0.16)},
        default: {true: changeOpacity(theme.buttonBg, 0.32), false: changeOpacity(theme.centerChannelColor, 0.24)},
    });
    const thumbColor = Platform.select({
        android: '#F3F3F3',
    });

    return (
        <View
            style={styles.container}
            onLayout={onLayout}
        >

            {(headerText && !disableHeader) && (
                <View style={[addButton && styles.flexRow]}>
                    <FormattedText
                        defaultMessage={headerText.defaultMessage}
                        id={headerText.id}
                        values={headerText.values}
                        style={[styles.header, headerStyles]}
                    />
                    {addButton && (
                        <View style={styles.button}>
                            <Switch
                                value={isSwitchOn}
                                onValueChange={toggleSwitch}
                                trackColor={trackColor}
                                thumbColor={thumbColor}
                            />
                        </View>
                    )}
                </View>
            )}
            <View style={[styles.contentContainerStyle, containerStyles]}>
                {children}
            </View>
            {(footerText && !disableFooter) &&
            <FormattedText
                defaultMessage={footerText.defaultMessage}
                id={footerText.id}
                style={[styles.footer, footerStyles]}
                values={footerText.values}
            />
            }
        </View>
    );
};

export default SettingBlock;
