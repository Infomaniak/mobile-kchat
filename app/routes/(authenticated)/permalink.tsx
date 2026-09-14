// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import PermalinkScreen from '@screens/permalink';

export default function PermalinkRoute() {
    const props = usePropsFromParams<any>();
    return <PermalinkScreen {...props}/>;
}
