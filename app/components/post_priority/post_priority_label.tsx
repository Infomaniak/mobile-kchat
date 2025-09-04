// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {defineMessages} from 'react-intl';

import Tag from '@components/tag';
import {PostPriorityType} from '@constants/post';

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
    transcript: {
        id: 'post_priority.label.transcript',
        defaultMessage: 'Automatically transcribed',
    },
});

const PRIORITY_CONFIG = {
    [PostPriorityType.URGENT]: {
        message: messages.urgent,
        icon: 'alert-outline',
        type: 'danger',
        uppercase: true,
    },
    [PostPriorityType.IMPORTANT]: {
        message: messages.important,
        icon: 'alert-circle-outline',
        type: 'info',
        uppercase: true,
    },
    [PostPriorityType.TRANSCRIPT]: {
        message: messages.transcript,
        icon: 'microphone-outline',
        type: 'transcript',
        uppercase: false,
    },
} as const;

const PostPriorityLabel = ({label}: Props) => {
    if (label === PostPriorityType.STANDARD) {
        return null;
    }

    const config = PRIORITY_CONFIG[label];

    return (
        <Tag
            message={config.message}
            icon={config.icon}
            type={config.type}
            size='xs'
            testID={`${label}_post_priority_label`}
            uppercase={config.uppercase}
        />
    );
};

export default PostPriorityLabel;
