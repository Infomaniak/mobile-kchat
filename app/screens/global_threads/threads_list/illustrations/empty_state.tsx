// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import Svg, {
    Circle,
    ClipPath,
    Defs,
    G,
    Path,
    Rect,
} from 'react-native-svg';

import {isDarkTheme} from '@utils/theme';

type Props = {
    theme: Theme;
};

function EmptyStateIllustration({theme}: Props) {
    if (isDarkTheme(theme)) {
        return (
            <Svg
                width={128}
                height={102}
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
    return (
        <Svg
            width={175.84}
            height={140}
            viewBox='0 0 314 250'
            preserveAspectRatio='none'
        >
            <Path
                d='M256.674 97.36h.613v26.099l24.477-25.907.182-.192h26.339a4.966 4.966 0 0 0 4.966-4.965V5.578a4.966 4.966 0 0 0-4.966-4.965H182.187a4.965 4.965 0 0 0-4.966 4.965v86.817a4.965 4.965 0 0 0 4.966 4.965h74.487Z'
                fill='#F1F1F1'
                stroke='#E0E0E0'
                strokeWidth={1.225}
            />
            <Path
                d='M157 250c86.633 0 156.863-7.681 156.863-17.157 0-9.475-70.23-17.156-156.863-17.156-86.632 0-156.862 7.681-156.862 17.156C.138 242.319 70.368 250 157 250Z'
                fill='#FAFAFA'
            />
            <Path
                d='M193.936 182.813h-.613v43.673l-44.559-43.499-.178-.174H5.716a4.965 4.965 0 0 1-4.966-4.965V27.637a4.965 4.965 0 0 1 4.966-4.966h233.941a4.965 4.965 0 0 1 4.966 4.966v150.211a4.965 4.965 0 0 1-4.966 4.965h-45.721Z'
                fill='#FAFAFA'
                stroke='#E0E0E0'
                strokeWidth={1.225}
            />
            <Circle
                cx={122.022}
                cy={109.844}
                r={39.216}
                fill='#3EBF4D'
            />
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='m144.159 98.785-22.758 31.286a3.335 3.335 0 0 1-4.755.633l-16.252-13.163a3.399 3.399 0 0 1-.518-4.735 3.297 3.297 0 0 1 4.674-.526l13.553 10.984L138.806 94.8a3.31 3.31 0 0 1 3.082-1.485 3.33 3.33 0 0 1 2.75 2.047 3.401 3.401 0 0 1-.479 3.423Z'
                fill='#fff'
                stroke='#3EBF4D'
                strokeWidth={2.219}
            />
        </Svg>
    );
}

export default EmptyStateIllustration;
