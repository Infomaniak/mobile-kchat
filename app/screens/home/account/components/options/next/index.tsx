// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';

import {useNextState} from '@hooks/network';
import OptionItem from '@components/option_item';

const COLOR = '#7974B4';

const styles = StyleSheet.create({
    labelText: {color: COLOR},
});

const Next = () => {
    const {formatMessage} = useIntl();
    const [isNext, onNextToggle] = useNextState();

    const label = useMemo(() => (isNext ? formatMessage({
        id: 'account.server_prod',
        defaultMessage: 'Switch to STABLE',
    }) : formatMessage({
        id: 'account.server_preprod',
        defaultMessage: 'Switch to NEXT',
    })), [isNext]);

    return typeof isNext === 'boolean' ? (
        <OptionItem
            action={onNextToggle}

            icon='flag'
            type='default'

            label={label}

            iconColor={COLOR}
            optionLabelTextStyle={styles.labelText}
        />
    ) : null;
};

export default Next;
