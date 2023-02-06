// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {DeviceEventEmitter, Image, Text, View} from 'react-native';
import Button from 'react-native-button';

import FormattedText from '@components/formatted_text';
import {Events} from '@constants';
import {useTheme} from '@context/theme';
import BottomSheet from '@screens/bottom_sheet';
import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId: AvailableScreens;
    onEmojiPress: (emoji: string) => void;
    closeButtonId: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    contentStyle: {
        flex: 1,
        alignItems: 'center',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: 256,
        height: undefined,
        aspectRatio: 1780 / 690,
    },
    title: {
        color: theme.centerChannelColor,
        marginTop: 24,
        textAlign: 'center',
        ...typography('Heading', 500, 'SemiBold'),
    },
    description: {
        color: theme.centerChannelColor,
        textAlign: 'center',
        marginTop: 12,
        ...typography('Body', 200, 'Regular'),
    },
    discoverButton: {
        marginTop: 16,
    },
    ikButton: {
        width: '100%',
        borderRadius: 8,
    },
}));

const IKChannelQuotaExceeded = ({closeButtonId, componentId}: Props) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const intl = useIntl();
    const styleButtonText = buttonTextStyle(theme, 'lg', 'primary', 'default');
    const styleButtonBackground = buttonBackgroundStyle(theme, 'lg', 'primary', 'default');

    const handleCloseButton = useCallback(() => {
        DeviceEventEmitter.emit(Events.CLOSE_BOTTOM_SHEET);
    }, []);

    const renderContent = useCallback(() => {
        return (
            <>
                <View style={styles.iconWrapper}>
                    <Image
                        style={styles.imagePlaceholder}
                        source={require('@assets/images/channels.png')}
                    />
                </View>
                <Text style={styles.title}>
                    {intl.formatMessage({id: 'infomaniak.quota_exceeded.title', defaultMessage: 'You have no kChat, discover it with kSuite'})}
                </Text>
                <Text style={styles.description}>
                    {intl.formatMessage({id: 'infomaniak.quota_exceeded.description', defaultMessage: 'You have no kChat, discover it with kSuite'})}
                </Text>
                <Button
                    containerStyle={[styles.discoverButton, styleButtonBackground, styles.ikButton]}
                    onPress={handleCloseButton}
                >
                    <FormattedText
                        defaultMessage={'Close'}
                        id={'channel_info.close'}
                        style={styleButtonText}
                    />
                </Button>
            </>
        );
    }, []);

    return (
        <BottomSheet
            renderContent={renderContent}
            closeButtonId={closeButtonId}
            componentId={componentId}
            contentStyle={styles.contentStyle}
            snapPoints={['55%', '55%']}
            initialSnapIndex={1}
        />
    );
};

export default IKChannelQuotaExceeded;
