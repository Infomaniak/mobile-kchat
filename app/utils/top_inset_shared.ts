// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {makeMutable} from 'react-native-reanimated';

export const topInsetShared = makeMutable(0);

export function useTopInsetShared() {
    return topInsetShared;
}
