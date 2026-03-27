// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl, type MessageDescriptor} from 'react-intl';

import OptionItem from '@components/option_item';

type BaseOptionType = {
    iconName?: string;
    message: MessageDescriptor;
    isDestructive?: boolean;
    onPress: () => void;
    testID: string;
    customIcon?: React.ReactNode;
    rightComponent?: React.ReactNode;
}

const BaseOption = ({
    customIcon,
    message,
    iconName,
    isDestructive = false,
    onPress,
    testID,
    rightComponent,
}: BaseOptionType) => {
    const intl = useIntl();

    return (
        <OptionItem
            action={onPress}
            destructive={isDestructive}
            icon={iconName}
            customIcon={customIcon}
            label={intl.formatMessage(message)}
            labelNumberOfLines={1}
            testID={testID}
            type='default'
            rightComponent={rightComponent}
        />
    );
};
export default BaseOption;
