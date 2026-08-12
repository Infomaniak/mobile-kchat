// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useTheme} from '@context/theme';
import {getHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import ReportProblemScreen from '@screens/report_a_problem';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    componentId: AvailableScreens;
    title: string;
}

export default function ReportProblemRoute() {
    const theme = useTheme();
    const {title, ...props} = usePropsFromParams<Props>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: title,
            ...getHeaderOptions(theme),
        },
    });

    return (<ReportProblemScreen {...props}/>);
}
