// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams} from 'expo-router';
import {useMemo} from 'react';

import NavigationPropsStore from '@store/navigation_props_store';
import {safeParseJSON} from '@utils/helpers';

export function usePropsFromParams<T extends Record<string, unknown> = Record<string, unknown>>(): T {
    const params = useLocalSearchParams<{props?: string; propsId?: string}>();
    const props = Array.isArray(params.props) ? params.props[0] : params.props;
    const propsId = Array.isArray(params.propsId) ? params.propsId[0] : params.propsId;

    return useMemo(() => {
        if (propsId) {
            return NavigationPropsStore.get(propsId) as T;
        }

        if (!props) {
            return {} as T;
        }

        return (safeParseJSON(props) || {}) as T;
    }, [props, propsId]);
}
