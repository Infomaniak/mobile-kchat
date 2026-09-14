// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams} from 'expo-router';

import {safeParseJSON} from '@utils/helpers';

export function usePropsFromParams<T>(): T {
    const params = useLocalSearchParams();

    const props = {} as T;
    Object.keys(params).forEach((key) => {
        const value = safeParseJSON(params[key]);
        (props as Record<string, unknown>)[key] = value;
    });

    return props;
}
