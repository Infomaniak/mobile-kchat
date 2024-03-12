// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Line, Path, Rect, Svg} from 'react-native-svg';

import {baseHeight, baseWidth, calculateHeight, type Props} from './utils';

const DarkTile: React.FC<Props> = ({width, borderColorBase, borderColorMix}) => {
    return (
        <Svg
            width={width}
            height={calculateHeight(width)}
            viewBox={`-2 -2 ${baseWidth + 4} ${baseHeight + 4}`}
            fill='none'
        >
            <Rect
                x='0.25'
                y='0.710327'
                width='99.5'
                height='64.5794'
                rx='3.75'
                fill='#1A1A1A'
                stroke='#333333'
                strokeWidth='0.5'
            />
            <Path
                d='M19.333 0.460327L19.333 65.3303'
                stroke='#333333'
                strokeWidth='0.5'
            />
            <Line
                x1='19.333'
                y1='6.21033'
                x2='99.333'
                y2='6.21032'
                stroke='#333333'
                strokeWidth='0.5'
            />
            <Path
                d='M93.166 11.4603H25.166C23.7853 11.4603 22.666 12.5796 22.666 13.9603C22.666 15.341 23.7853 16.4603 25.166 16.4603H93.166C94.5467 16.4603 95.666 15.341 95.666 13.9603C95.666 12.5796 94.5467 11.4603 93.166 11.4603Z'
                fill='#333333'
            />
            <Path
                d='M15.333 4.46033H4.33301C3.22844 4.46033 2.33301 5.35576 2.33301 6.46033C2.33301 7.5649 3.22844 8.46033 4.33301 8.46033H15.333C16.4376 8.46033 17.333 7.5649 17.333 6.46033C17.333 5.35576 16.4376 4.46033 15.333 4.46033Z'
                fill='#333333'
            />
            <Path
                d='M13.333 11.4603H3.33301C2.78072 11.4603 2.33301 11.908 2.33301 12.4603C2.33301 13.0126 2.78072 13.4603 3.33301 13.4603H13.333C13.8853 13.4603 14.333 13.0126 14.333 12.4603C14.333 11.908 13.8853 11.4603 13.333 11.4603Z'
                fill='#333333'
            />
            <Path
                d='M13.333 14.4603H3.33301C2.78072 14.4603 2.33301 14.908 2.33301 15.4603C2.33301 16.0126 2.78072 16.4603 3.33301 16.4603H13.333C13.8853 16.4603 14.333 16.0126 14.333 15.4603C14.333 14.908 13.8853 14.4603 13.333 14.4603Z'
                fill='#333333'
            />
            <Path
                d='M93.6028 17.6031H24.6016C23.4619 17.6031 22.5381 18.527 22.5381 19.6666C22.5381 20.8063 23.4619 21.7301 24.6016 21.7301H93.6028C94.7424 21.7301 95.6663 20.8063 95.6663 19.6666C95.6663 18.527 94.7424 17.6031 93.6028 17.6031Z'
                fill='#333333'
            />
            <Path
                d='M93.6028 23.3175H24.6016C23.4619 23.3175 22.5381 24.2414 22.5381 25.381C22.5381 26.5206 23.4619 27.4445 24.6016 27.4445H93.6028C94.7424 27.4445 95.6663 26.5206 95.6663 25.381C95.6663 24.2414 94.7424 23.3175 93.6028 23.3175Z'
                fill='#333333'
            />
            <Rect
                x='-1'
                width={baseWidth}
                height={baseHeight}
                rx='4'
                strokeLinejoin='round'
                stroke={borderColorBase}
                strokeWidth='2'
            />
            <Rect
                x='-1'
                width={baseWidth}
                height={baseHeight}
                rx='4'
                stroke={borderColorMix}
                strokeWidth='2'
            />
        </Svg>

    );
};

export default DarkTile;
