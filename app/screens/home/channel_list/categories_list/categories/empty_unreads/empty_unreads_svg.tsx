// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

function SvgComponent() {
    return (
        <Svg
            width={175.84}
            height={140}
            viewBox='0 0 314 250'
            preserveAspectRatio='none'
        >
            <Path
                d='M256.536 97.36h.613v26.099l24.477-25.907.182-.192h26.339a4.965 4.965 0 0 0 4.966-4.965V5.578a4.965 4.965 0 0 0-4.966-4.965H182.049a4.965 4.965 0 0 0-4.965 4.965v86.817a4.965 4.965 0 0 0 4.965 4.965h74.487Z'
                fill='#7C7C7C'
                stroke='#4C4C4C'
                strokeWidth={1.225}
            />
            <Path
                d='M156.863 250c86.632 0 156.862-7.681 156.862-17.157 0-9.475-70.23-17.156-156.862-17.156C70.23 215.687 0 223.368 0 232.843 0 242.319 70.23 250 156.863 250Z'
                fill='#282828'
            />
            <Path
                d='M193.798 182.813h-.612v43.673l-44.559-43.499-.179-.174H5.579a4.965 4.965 0 0 1-4.966-4.965V27.637a4.965 4.965 0 0 1 4.965-4.966H239.52a4.965 4.965 0 0 1 4.965 4.966v150.211a4.965 4.965 0 0 1-4.965 4.965h-45.722Z'
                fill='#282828'
                stroke='#4C4C4C'
                strokeWidth={1.225}
            />
            <Circle
                cx={121.885}
                cy={109.844}
                r={39.216}
                fill='#3EBF4D'
            />
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='m144.021 98.785-22.759 31.286a3.332 3.332 0 0 1-4.754.633l-16.252-13.163a3.398 3.398 0 0 1-.519-4.735 3.298 3.298 0 0 1 4.675-.526l13.552 10.984L138.668 94.8a3.309 3.309 0 0 1 3.081-1.485 3.33 3.33 0 0 1 2.75 2.047 3.404 3.404 0 0 1-.478 3.423Z'
                fill='#EAEAEA'
                stroke='#3EBF4D'
                strokeWidth={2.219}
            />
        </Svg>
    );
}

export default SvgComponent;
