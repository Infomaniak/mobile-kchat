// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';

import OptionItem from '@components/option_item';
import {useNextState} from '@hooks/network';

const COLOR = '#7974B4';

const Next = () => {
    const {formatMessage} = useIntl();
    const [isNext, onNextToggle] = useNextState();

    const label = useMemo(() => (isNext ? formatMessage({
        id: 'account.server_prod',
        defaultMessage: 'Switch to STABLE',
    }) : formatMessage({
        id: 'account.server_preprod',
        defaultMessage: 'Switch to NEXT',
    })), [formatMessage, isNext]);

    return typeof isNext === 'boolean' ? (
        <OptionItem
            action={onNextToggle}
            icon='flag'
            type='default'
            label={label}
            iconColor={COLOR}
        />
    ) : null;
};

export default Next;
