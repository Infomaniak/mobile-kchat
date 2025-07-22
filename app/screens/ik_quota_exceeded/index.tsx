// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import BottomSheetM, {BottomSheetBackdrop, type BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import {Button} from '@rneui/base';
import React, {useCallback, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Image, Text, View} from 'react-native';

import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import {dismissModal} from '@screens/navigation';
import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId: AvailableScreens;
    quotaType: IKQuotaExceeded;
    closeButtonId: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    contentStyle: {
        flex: 1,
        alignItems: 'center',
    },
    bottomSheet: {
        backgroundColor: theme.centerChannelBg,
        borderTopStartRadius: 24,
        borderTopEndRadius: 24,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowColor: '#000',
        elevation: 24,
    },
    bottomSheetBackground: {
        backgroundColor: theme.centerChannelBg,
        borderColor: changeOpacity(theme.centerChannelColor, 0.16),
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: undefined,
        height: 96,
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
        borderRadius: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
}));

export type IKQuotaExceeded = {
    title: string;
    description: string;
    image: 'channels' | 'storage';
}

const IKChannelQuotaExceeded = ({closeButtonId, quotaType = {
    title: 'infomaniak.size_quota_exceeded.title',
    description: 'infomaniak.size_quota_exceeded.description',
    image: 'storage',
}, componentId}: Props) => {
    const allImages = {
        channels: {path: require('@assets/images/channels.png'), ratio: 1780 / 690},
        storage: {path: require('@assets/images/storage_full_light.png'), ratio: 632 / 651},
    };
    const sheetRef = useRef<BottomSheetM>(null);
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const handleCloseButton = useCallback(() => {
        handleClose();
    }, []);

    const close = useCallback(() => {
        dismissModal({componentId});
    }, [componentId]);

    const handleClose = useCallback(() => {
        if (sheetRef.current) {
            sheetRef.current.close();
        } else {
            close();
        }
    }, []);

    useAndroidHardwareBackHandler(componentId, handleClose);
    useNavButtonPressed(closeButtonId || '', componentId, close, [close]);

    const renderContent = useCallback(() => {
        return (
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Image
                        style={[styles.imagePlaceholder, {aspectRatio: allImages[quotaType.image].ratio}]}
                        source={allImages[quotaType.image].path}
                    />
                </View>
                <Text style={styles.title}>
                    {intl.formatMessage({id: quotaType.title, defaultMessage: 'You have no kChat, discover it with kSuite'})}
                </Text>
                <Text style={styles.description}>
                    {intl.formatMessage({id: quotaType.description, defaultMessage: 'You have no kChat, discover it with kSuite'})}
                </Text>
                <Button
                    title={intl.formatMessage({
                        id: 'channel_info.close',
                        defaultMessage: 'Close',
                    })}
                    titleStyle={buttonTextStyle(theme, 'lg', 'primary', 'default')}
                    containerStyle={styles.discoverButton}
                    buttonStyle={[
                        buttonBackgroundStyle(theme, 'lg', 'primary', 'default'),
                        styles.ikButton,
                    ]}
                    onPress={handleCloseButton}
                />
            </View>
        );
    }, []);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
        return (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.6}
            />
        );
    }, []);

    return (
        <BottomSheetM
            ref={sheetRef}
            index={0}
            snapPoints={['55%']}
            animateOnMount={true}
            style={styles.bottomSheet}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            onClose={close}
        >
            {renderContent()}
        </BottomSheetM>
    );
};

export default IKChannelQuotaExceeded;
