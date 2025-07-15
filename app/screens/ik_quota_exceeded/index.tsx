// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import BottomSheetM, {BottomSheetBackdrop, type BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import {Button} from '@rneui/base';
import React, {useCallback, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Text, View} from 'react-native';

import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import Header from '@screens/ik_evolve/icons/top';
import {dismissModal} from '@screens/navigation';
import {buttonBackgroundStyle} from '@utils/buttonStyles';
import {makeStyleSheetFromTheme} from '@utils/theme';
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
        borderTopWidth: 50,
        borderColor: '#222633',
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
        maxWidth: '95%',
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
        width: 343,
        height: 56,
        backgroundColor: '#F1F1F1',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 16,
    },
    ikTextButton: {
        fontFamily: 'SuisseIntl',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0,
        color: '#000',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 24,
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
            <View style={{flex: 1}}>
                <View style={styles.content}>
                    <Header/>

                    <View>
                        <Text style={styles.title}>
                            {intl.formatMessage({id: quotaType.title})}
                        </Text>
                        <Text style={styles.description}>
                            {intl.formatMessage({id: quotaType.description})}
                        </Text>
                    </View>

                    <Button
                        title={intl.formatMessage({
                            id: 'channel_info.close',
                            defaultMessage: 'Close',
                        })}
                        titleStyle={styles.ikTextButton}
                        containerStyle={styles.discoverButton}
                        buttonStyle={[
                            buttonBackgroundStyle(theme, 'lg', 'primary', 'default'),
                            styles.ikButton,
                        ]}
                        onPress={handleCloseButton}
                    />
                </View>
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
