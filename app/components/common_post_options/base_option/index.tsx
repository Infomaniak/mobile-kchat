// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import OptionItem from '@components/option_item';

type BaseOptionType = {
    defaultMessage: string;
    i18nId: string;
    iconName?: string;
    isDestructive?: boolean;
    onPress: () => void;
    testID: string;
    customIcon?: React.ReactNode;
    rightComponent?: React.ReactNode;
}

const BaseOption = ({
    defaultMessage,
    customIcon,
    i18nId,
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
            label={intl.formatMessage({id: i18nId, defaultMessage})}
            testID={testID}
            type='default'
            rightComponent={rightComponent}
        />
    );
};
export default BaseOption;
