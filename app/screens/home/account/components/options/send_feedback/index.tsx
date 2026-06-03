// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Platform} from 'react-native';

import OptionItem from '@components/option_item';
import {Screens} from '@constants';
import {usePreventDoubleTap} from '@hooks/utils';
import {goToScreen, showModal} from '@screens/navigation';

const SendFeedback = () => {
    const intl = useIntl();

    const openSendFeedback = usePreventDoubleTap(useCallback(() => {
        const title = intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Send Feedback'});
        if (Platform.OS === 'ios') {
            showModal(Screens.SEND_FEEDBACK, title);
        } else {
            goToScreen(Screens.SEND_FEEDBACK, title);
        }
    }, [intl]));

    return (
        <OptionItem
            action={openSendFeedback}
            icon='message-text-outline'
            label={intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Send feedback'})}
            testID='account.send_feedback.option'
            type='default'
        />
    );
};

export default SendFeedback;
