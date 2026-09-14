// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import IKReminder, {type IKReminderProps} from '@screens/ik_reminder';

export default function Route() {
    const props = usePropsFromParams<IKReminderProps>();
    return <IKReminder {...props}/>;
}
