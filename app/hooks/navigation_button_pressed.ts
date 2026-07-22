// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type DependencyList, type EffectCallback, useEffect} from 'react';

import {addNavigationButtonPressedListener} from '@screens/navigation_button_events';

type Callback = EffectCallback | (() => Promise<void>);
const useNavButtonPressed = (navButtonId: string, componentId: string, callback: Callback, deps?: DependencyList) => {
    useEffect(() => {
        const unsubscribe = addNavigationButtonPressedListener(({buttonId, componentId: eventComponentId}) => {
            if (buttonId === navButtonId && (!eventComponentId || eventComponentId === componentId)) {
                callback();
            }
        });

        return () => {
            unsubscribe.remove();
        };

    // The dependencies should be passed by the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useNavButtonPressed;
