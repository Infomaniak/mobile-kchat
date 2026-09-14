// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {GestureStateChangeEvent, PanGestureHandlerEventPayload} from 'react-native-gesture-handler';
import type {WithSpringConfig} from 'react-native-reanimated';

export const pagerPanSpringConfig = (evt: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    'worklet';
    return {
        stiffness: Math.min(500, Math.max(100, Math.abs(evt.velocityX) * 10)),
        damping: Math.max(20, Math.abs(evt.velocityX) * 0.2),
        mass: 1.5,
        overshootClamping: true,
    };
};

export function pagerSpringVelocityConfig(velocity: number): WithSpringConfig {
    'worklet';

    const ratio = 1.1;
    const mass = 0.4;
    const stiffness = 100.0;

    return {
        stiffness,
        mass,
        damping: ratio * 2.0 * Math.sqrt(mass * stiffness),
        velocity,
    };
}

export const transformerSpringConfig: WithSpringConfig = {
    stiffness: 200,
    damping: 25,
    mass: 1,
    overshootClamping: true,
};
