// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Button} from '@rneui/base';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Text, View} from 'react-native';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import BottomSheet from '@screens/bottom_sheet';
import Header from '@screens/ik_evolve/icons/top';
import {dismissBottomSheet} from '@screens/navigation';
import {buttonBackgroundStyle} from '@utils/buttonStyles';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

type Props = {
    quotaType: IKQuotaExceeded;
    closeButtonId: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    contentStyle: {
        flex: 1,
        alignItems: 'center',
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
}}: Props) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const close = () => {
        dismissBottomSheet();
    };

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

                        onPress={close}
                    />
                </View>
            </View>
        );
    }, []);

    const snapPoints = [1, '55%'];

    return (
        <BottomSheet
            renderContent={renderContent}
            closeButtonId={closeButtonId}
            componentId={Screens.INFOMANIAK_QUOTA_EXCEEDED}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            contentStyle={{paddingHorizontal: 0}}
            headerStyle={{
                borderTopWidth: 50,
                borderColor: '#222633',
            }}
        />
    );
};

export default IKChannelQuotaExceeded;
