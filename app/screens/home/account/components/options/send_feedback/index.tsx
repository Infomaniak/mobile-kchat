// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';

import OptionItem from '@components/option_item';
import {Screens} from '@constants';
import {useIsInfomaniakServer} from '@hooks/network';
import {usePreventDoubleTap} from '@hooks/utils';
import {goToScreen} from '@screens/navigation';

const SendFeedback = () => {
    const intl = useIntl();
    const isServerInfomaniak = useIsInfomaniakServer();

    const openSendFeedback = usePreventDoubleTap(useCallback(() => {
        const title = intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Send Feedback'});
        goToScreen(Screens.SEND_FEEDBACK, title);
    }, [intl]));

    return isServerInfomaniak ? (
        <OptionItem
            action={openSendFeedback}
            icon='message-text-outline'
            label={intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Send feedback'})}
            testID='account.send_feedback.option'
            type='default'
        />
    ) : null;
};

export default SendFeedback;
