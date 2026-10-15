// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {supportsNativeTabs} from '@constants/device';

// Bottom content inset needed to keep the last list item reachable above the
// floating native tab bar (iOS 26+). Undefined when native tabs are off, so
// the JS tab bar and Android keep their existing behavior.
function useBottomContentInset() {
    const {bottom} = useSafeAreaInsets();

    // Memoized because the object is passed as a prop to FlatLists.
    return useMemo(() => (supportsNativeTabs ? {bottom} : undefined), [bottom]);
}

export default useBottomContentInset;
