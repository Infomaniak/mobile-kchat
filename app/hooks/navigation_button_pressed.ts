// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useNavigation} from 'expo-router';
import {type DependencyList, type EffectCallback, useEffect} from 'react';

type Callback = EffectCallback | (() => Promise<void>);
const useNavButtonPressed = (navButtonId: string, _componentId: string, callback: Callback, deps?: DependencyList) => {
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            callback();
        });

        return () => {
            unsubscribe();
        };

    // The dependencies should be passed by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useNavButtonPressed;
