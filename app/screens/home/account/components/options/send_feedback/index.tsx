// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Image} from 'react-native';

import OptionItem from '@components/option_item';
import {Screens} from '@constants';
import {useIsInfomaniakServer} from '@hooks/network';
import {usePreventDoubleTap} from '@hooks/utils';
import {goToScreen} from '@screens/navigation';

const miniMonsterIcon = require('@assets/images/mini-monster.png');
const miniMonsterIconStyle = {width: 24, height: 24, marginRight: 16};

const SendFeedback = () => {
    const intl = useIntl();
    const isServerInfomaniak = useIsInfomaniakServer();

    const openSendFeedback = usePreventDoubleTap(useCallback(() => {
        const title = intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Reporting tools'});
        goToScreen(Screens.SEND_FEEDBACK, title);
    }, [intl]));

    return isServerInfomaniak ? (
        <OptionItem
            action={openSendFeedback}
            customIcon={(
                <Image
                    resizeMode='contain'
                    source={miniMonsterIcon}
                    style={miniMonsterIconStyle}
                />
            )}
            label={intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Reporting tools'})}
            testID='account.send_feedback.option'
            type='default'
        />
    ) : null;
};

export default SendFeedback;
