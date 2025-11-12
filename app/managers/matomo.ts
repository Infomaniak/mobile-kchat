// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import MatomoTracker from 'matomo-tracker-react-native';

export const matomo = new MatomoTracker({
    urlBase: 'https://analytics.infomaniak.com/',
    siteId: 13,
});
