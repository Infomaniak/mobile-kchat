// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import {navigateBack} from '@screens/navigation';
import RescheduleDraftScreen from '@screens/reschedule_draft';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId: AvailableScreens;
    closeButtonId: string;
    draft: any;
    [key: string]: any;
}

export default function RescheduleDraftRoute() {
    const intl = useIntl();
    const theme = useTheme();
    const {componentId, ...props} = usePropsFromParams<Props>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: intl.formatMessage({id: 'mobile.reschedule_draft.title', defaultMessage: 'Change Schedule'}),
            ...getModalHeaderOptions(theme, navigateBack, 'close.reschedule_draft.button'),
        },
    });

    return (
        <RescheduleDraftScreen
            componentId={componentId ?? Screens.RESCHEDULE_DRAFT}
            {...props}
        />
    );
}
