// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

type Props = {
    theme: Theme;
};

function EmptyStateIllustration({theme}: Props) {
    return (
        <Svg
            width={128}
            height={102}
        >
            <Path
                d='M104.667 39.723h.25v10.648l9.987-10.57.074-.078H125.724a2.026 2.026 0 0 0 2.026-2.026V2.276A2.026 2.026 0 0 0 125.724.25H74.276a2.026 2.026 0 0 0-2.026 2.026v35.421c0 1.119.907 2.026 2.026 2.026h30.391Z'
                fill='#F1F1F1'
                stroke='#E0E0E0'
                strokeWidth={0.5}
            />
            <Path
                d='M64 102c35.346 0 64-3.134 64-7s-28.654-7-64-7c-35.346 0-64 3.134-64 7s28.654 7 64 7Z'
                fill='#FAFAFA'
            />
            <Path
                d='M79.07 74.588h-.25v17.819L60.64 74.659l-.073-.071H2.275A2.026 2.026 0 0 1 .25 72.562V11.276c0-1.119.907-2.026 2.026-2.026h95.448c1.119 0 2.026.907 2.026 2.026v61.286a2.026 2.026 0 0 1-2.026 2.026H79.07Z'
                fill='#FAFAFA'
                stroke='#E0E0E0'
                strokeWidth={0.5}
            />
            <Circle
                cx={49.729}
                cy={44.816}
                r={16}
                fill='#3EBF4D'
            />
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M58.76 40.304 49.476 53.07a1.358 1.358 0 0 1-1.94.258l-6.63-5.37a1.387 1.387 0 0 1-.212-1.932 1.345 1.345 0 0 1 1.907-.215l5.53 4.482 8.447-11.613a1.35 1.35 0 0 1 1.257-.606c.497.047.928.368 1.122.835a1.389 1.389 0 0 1-.195 1.396Z'
                fill='#fff'
                stroke='#3EBF4D'
                strokeWidth={0.905}
            />
        </Svg>
    );
}

export default EmptyStateIllustration;
