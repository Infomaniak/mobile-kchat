// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import moment from 'moment-timezone';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-elements';

import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import CallManager from '@store/CallManager';
import PostModel from '@typings/database/models/servers/post';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import KMeetIcon from './kmeet_icon';

type CallMessageProps = {
    post: PostModel;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            borderWidth: 0.25,
            borderColor: changeOpacity(theme.centerChannelColor, 0.6),
            borderRadius: 4,
            marginTop: 8,
            marginBottom: 8,
        },
        systemMessageTitle: {
            color: theme.centerChannelColor,
            ...typography('Heading', 200, 'SemiBold'),
        },
        systemMessageDescription: {
            color: theme.centerChannelColor,
            ...typography('Body', 200, 'Regular'),
        },
        iconContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            marginRight: 8,
        },
        iconMessageContainer: {
            flexDirection: 'row',
            padding: 16,
        },
        joinCallContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        joinCallButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: '#0098FF',
            margin: 8,
            borderRadius: 4,
        },
        joinCallButtonText: {
            color: 'white',
            marginLeft: 15,
            ...typography('Body', 200, 'SemiBold'),
        },
        joinIcon: {
            display: 'flex',
            color: 'white',
            width: 42,
            height: 42,
            textAlign: 'center',
            textAlignVertical: 'center',
            justifyContent: 'center',
            backgroundColor: '#0098FF',
            borderRadius: 4,
            margin: 4,
            padding: 9,
        },
    };
});

const CallMessage = (props: CallMessageProps) => {
    const theme = useTheme();
    const serverUrl = useServerUrl();
    const styles = getStyleSheet(theme);

    const startedAt = props.post.props.start_at;
    const endedAt = props.post.props.end_at;
    let descriptionText = '';

    if (startedAt) {
        if (endedAt) {
            const endedAtDate = moment(endedAt).format('hh:mm');
            descriptionText = 'Ended at ' + endedAtDate;
        } else {
            const startedAtDate = moment(startedAt).format('hh:mm');
            descriptionText = 'Started at ' + startedAtDate;
        }
    }

    let callButton = null;
    if (startedAt && !endedAt) {
        const handlePickup = () => {
            CallManager.startCall(serverUrl, props.post.channelId);
        };

        callButton = (
            <View>
                <Divider/>
                <View style={styles.joinCallContainer}>
                    <View/>
                    <TouchableOpacity
                        onPress={handlePickup}
                        style={styles.joinCallButton}
                    >
                        <FormattedText
                            style={styles.joinCallButtonText}
                            defaultMessage={'Open'}
                            id={'mobile.open_kmeet'}
                        />
                        <CompassIcon
                            name={'phone-in-talk'}
                            size={24}
                            style={styles.joinIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconMessageContainer}>
                <View style={styles.iconContainer}>
                    <KMeetIcon/>
                </View>
                <View>
                    <Text style={styles.systemMessageTitle}>
                        {props.post.message}
                    </Text>
                    <Text style={styles.systemMessageDescription}>
                        {descriptionText}
                    </Text>
                </View>

            </View>
            {callButton}
        </View>
    );
};

export default CallMessage;
