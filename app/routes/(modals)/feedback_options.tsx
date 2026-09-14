// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Screens} from '@constants';
import {getBottomSheetHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import FeedbackOptionsScreen from '@screens/feedback_options';

export default function FeedbackOptionsRoute() {
    const props = usePropsFromParams<any>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: getBottomSheetHeaderOptions(),
    });

    return (
        <FeedbackOptionsScreen
            componentId={Screens.FEEDBACK_OPTIONS}
            {...props}
        />
    );
}
