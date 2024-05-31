// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';

import {useNextState} from '@app/hooks/network';
import OptionItem from '@components/option_item';

const COLOR = '#7974B4';

const styles = StyleSheet.create({
    labelText: {color: COLOR},
});

const Next = () => {
    const {formatMessage} = useIntl();
    const [isNext, onNextToggle] = useNextState();

    return typeof isNext === 'boolean' ? (
        <OptionItem
            action={onNextToggle}

            icon='flag'
            type='default'

            label={formatMessage({
                id: `account.server_${isNext ? '' : 'pre'}prod`,
                defaultMessage: `Switch to ${isNext ? 'STABLE' : 'NEXT'}`,
            })}

            iconColor={COLOR}
            optionLabelTextStyle={styles.labelText}
        />
    ) : null;
};

export default Next;
