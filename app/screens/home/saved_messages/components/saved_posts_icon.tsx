// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

import {useTheme} from '@context/theme';

export default function SavedPostsIcon() {
    const theme = useTheme();
    if (theme.ikName === 'Dark') {
        return (
            <Svg
                width={155}
                height={153}
                viewBox='0 0 309 250'
                fill='none'
            >
                <Path
                    d='M252.568 96.374h.599v25.837l24.076-25.648.177-.189h25.938a4.85 4.85 0 0 0 4.85-4.85V5.448a4.85 4.85 0 0 0-4.85-4.85H179.283a4.85 4.85 0 0 0-4.85 4.85v86.076a4.85 4.85 0 0 0 4.85 4.85h73.285Z'
                    fill='#7C7C7C'
                    stroke='#4C4C4C'
                    strokeWidth={1.197}
                />
                <Path
                    d='M153.209 250c84.372 0 152.769-7.997 152.769-17.862 0-9.865-68.397-17.862-152.769-17.862-84.373 0-152.77 7.997-152.77 17.862 0 9.865 68.397 17.862 152.77 17.862Z'
                    fill='#282828'
                />
                <Path
                    d='M186.762 182.011h-.598V224.943l-42.923-42.757-.175-.175H5.448a4.85 4.85 0 0 1-4.85-4.849V29.376a4.85 4.85 0 0 1 4.85-4.85h225.303a4.85 4.85 0 0 1 4.85 4.85v147.786a4.85 4.85 0 0 1-4.85 4.849h-43.989Z'
                    fill='#282828'
                    stroke='#4C4C4C'
                    strokeWidth={1.197}
                />
                <Circle
                    cx={118.674}
                    cy={100.614}
                    fill='#0088B2'
                    r={36.118}
                />
                <Path
                    d='M107.065 88.724c0-.557.45-1.01 1.007-1.01h21.204c.558 0 1.008.453 1.008 1.01v26.795a1.01 1.01 0 0 1-1.561.846l-9.497-6.194a1.012 1.012 0 0 0-1.103 0l-9.497 6.194a1.01 1.01 0 0 1-1.561-.846V88.724Z'
                    fill='#EAEAEA'
                />
            </Svg>
        );
    }
    return (
        <Svg
            width={155}
            height={153}
            viewBox='0 0 309 250'
            fill='none'
        >
            <Path
                d='M252.569 96.374h.598v25.837l24.076-25.648.177-.189h25.939a4.85 4.85 0 0 0 4.849-4.85V5.448a4.85 4.85 0 0 0-4.849-4.85H179.283a4.85 4.85 0 0 0-4.849 4.85v86.076a4.85 4.85 0 0 0 4.849 4.85h73.286Z'
                fill='#F1F1F1'
                stroke='#E0E0E0'
                strokeWidth={1.197}
            />
            <Path
                d='M153.208 250c84.372 0 152.77-7.997 152.77-17.862 0-9.865-68.398-17.862-152.77-17.862-84.373 0-152.77 7.997-152.77 17.862 0 9.865 68.397 17.862 152.77 17.862Z'
                fill='#FAFAFA'
            />
            <Path
                d='M186.763 182.012h-.599V224.944l-42.923-42.757-.175-.175H5.449a4.85 4.85 0 0 1-4.85-4.849V29.377a4.85 4.85 0 0 1 4.85-4.85h225.303a4.85 4.85 0 0 1 4.849 4.85v147.786a4.849 4.849 0 0 1-4.849 4.849h-43.989Z'
                fill='#FAFAFA'
                stroke='#E0E0E0'
                strokeWidth={1.197}
            />
            <Circle
                cx={118.673}
                cy={100.614}
                fill='#0088B2'
                r={36.118}
            />
            <Path
                d='M107.064 88.724c0-.557.45-1.01 1.007-1.01h21.204c.558 0 1.008.453 1.008 1.01v26.795a1.01 1.01 0 0 1-1.561.846l-9.497-6.194a1.012 1.012 0 0 0-1.103 0l-9.497 6.194a1.01 1.01 0 0 1-1.561-.846V88.724Z'
                fill='#fff'
            />
        </Svg>
    );
}
