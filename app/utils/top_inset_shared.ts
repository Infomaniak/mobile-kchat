// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {useSharedValue} from 'react-native-reanimated';

export function useTopInsetShared() {
    return useSharedValue(0);
}
