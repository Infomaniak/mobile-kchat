// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {defineMessages} from 'react-intl';
import {useIntl} from 'react-intl';
import {type StyleProp, StyleSheet, Text, type TextStyle, View, type ViewStyle} from 'react-native';

import CompassIcon from '@components/compass_icon';
import Tag from '@components/tag';
import {PostPriorityColors, PostPriorityType} from '@constants/post';
import {typography} from '@utils/typography';

const style = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        borderRadius: 4,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    urgent: {
        backgroundColor: PostPriorityColors.URGENT,
    },
    important: {
        backgroundColor: PostPriorityColors.IMPORTANT,
    },
    transcript: {
        backgroundColor: PostPriorityColors.TRANSCRIPT,
    },
    transcriptLabel: {
        color: PostPriorityColors.TRANSCRIPT_LABEL,
    },
    transcriptIcon: {
        color: PostPriorityColors.TRANSCRIPT_ICON,
    },
    label: {
        color: '#fff',
        ...typography('Body', 25, 'SemiBold'),
    },
    icon: {
        color: '#fff',
        fontSize: 12,
        marginRight: 4,
    },
});

type Props = {
    label: PostPriority['priority'];
};

const messages = defineMessages({
    urgent: {
        id: 'post_priority.label.urgent',
        defaultMessage: 'URGENT',
    },
    important: {
        id: 'post_priority.label.important',
        defaultMessage: 'IMPORTANT',
    },
});

const PostPriorityLabel = ({label}: Props) => {
    if (label === PostPriorityType.STANDARD) {
        return null;
    }

    const isUrgent = label === PostPriorityType.URGENT; // else it is important

    return (
        <Tag
            message={isUrgent ? messages.urgent : messages.important}
            icon={isUrgent ? 'alert-outline' : 'alert-circle-outline'}
            type={isUrgent ? 'danger' : 'info'}
            size='xs'
            testID={`${label}_post_priority_label`}
            uppercase={true}
        />

    // const containerStyle: StyleProp<ViewStyle> = [style.container];
    // const labelStyle: StyleProp<TextStyle> = [style.label];
    // const iconStyle: StyleProp<TextStyle> = [style.icon];

    // let iconName = '';
    // let labelText = '';
    // if (label === PostPriorityType.URGENT) {
    //     containerStyle.push(style.urgent);
    //     iconName = 'alert-outline';
    //     labelText = intl.formatMessage({id: 'post_priority.label.urgent', defaultMessage: 'URGENT'});
    // } else if (label === PostPriorityType.IMPORTANT) {
    //     containerStyle.push(style.important);
    //     iconName = 'alert-circle-outline';
    //     labelText = intl.formatMessage({id: 'post_priority.label.important', defaultMessage: 'IMPORTANT'});
    // } else if (label === PostPriorityType.TRANSCRIPT) {
    //     containerStyle.push(style.transcript);
    //     iconStyle.push(style.transcriptIcon);
    //     labelStyle.push(style.transcriptLabel);
    //     iconName = 'microphone-outline';
    //     labelText = intl.formatMessage({id: 'post_priority.label.iortant', defaultMessage: 'Transcrit Automatiquement'});
    // }

    // return (
    //     <View style={containerStyle}>
    //         <CompassIcon
    //             name={iconName}
    //             style={iconStyle}
    //         />
    //         <Text style={labelStyle}>{labelText}</Text>
    //     </View>
    );
};

export default PostPriorityLabel;
