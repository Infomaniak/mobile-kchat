// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type FC} from 'react';
import {useIntl} from 'react-intl';
import {Platform, Text, View} from 'react-native';

import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import InfoSvgComponent from '../illustrations/info';

type Props = {
    guestsCount?: number;
}

const getStyle = makeStyleSheetFromTheme((theme: Theme) => ({
    Container: {
        backgroundColor: theme.guestBannerBackground,
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderBottomColor: changeOpacity(theme.centerChannelColor, 0.20),
        borderBottomWidth: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginBottom: Platform.OS === 'ios' ? 7 : 4,
    },
    Text: {
        color: theme.centerChannelColor,
        fontSize: 13,
    },
    Empty: {
        paddingTop: Platform.OS === 'ios' ? 7 : 4,
    },
}));

const GuestBanner: FC<Props> = ({guestsCount}) => {
    const theme = useTheme();
    const styles = getStyle(theme);
    const intl = useIntl();

    return (
        guestsCount ? <View style={styles.Container}>
            <InfoSvgComponent/>
            <Text style={styles.Text}>
                {intl.formatMessage({
                    id: 'guest_banner.text',
                    defaultMessage: 'There {count, plural, one {is} other {are}} {count} external {count, plural, one {user} other {users}} in this conversation.',
                },
                {count: guestsCount})}
            </Text>
        </View> : <View style={styles.Empty}/>
    );
};

export default React.memo(GuestBanner);
