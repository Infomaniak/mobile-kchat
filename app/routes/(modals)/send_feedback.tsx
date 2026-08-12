// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {navigateBack} from '@screens/navigation';
import SendFeedbackScreen from '@screens/send_feedback';

export default function SendFeedbackRoute() {
    const intl = useIntl();
    const theme = useTheme();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: intl.formatMessage({id: 'account.send_feedback', defaultMessage: 'Send Feedback'}),
            ...getModalHeaderOptions(theme, navigateBack, 'close.send_feedback.button'),
        },
    });

    return (<SendFeedbackScreen componentId={Screens.SEND_FEEDBACK}/>);
}
