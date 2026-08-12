// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams} from 'expo-router';
import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {navigateBack} from '@screens/navigation';
import SettingsDisplayTimezoneSelectScreen from '@screens/settings/display_timezone_select';

type Props = {
    currentTimezone: string;
}

export default function SettingsDisplayTimezoneSelectRoute() {
    const {currentTimezone} = useLocalSearchParams<Props>();
    const intl = useIntl();
    const theme = useTheme();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: intl.formatMessage({id: 'settings_display.timezone.select', defaultMessage: 'Select Timezone'}),
            ...getHeaderOptions(theme),
        },
    });

    return (
        <SettingsDisplayTimezoneSelectScreen
            componentId={Screens.SETTINGS_DISPLAY_TIMEZONE_SELECT}
            currentTimezone={currentTimezone}
            onBack={navigateBack}
        />
    );
}
