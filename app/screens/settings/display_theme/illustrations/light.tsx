// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {G, Path, Rect, Defs, ClipPath, Mask} from 'react-native-svg';

import {baseHeight, baseWidth, calculateHeight, type Props} from './utils';

const LightTile: React.FC<Props> = ({width, borderColorBase, borderColorMix}) => {
    return (
        <Svg
            width={width}
            height={calculateHeight(width)}
            viewBox={`-2 -2 ${baseWidth + 4} ${baseHeight + 4}`}
            fill='none'
        >
            <G clipPath='url(#clip0_1_4)'>
                <Mask
                    id='mask0_1_4'
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    style={{
                        maskType: 'luminance',
                    }}
                    maskUnits='userSpaceOnUse'
                    x={0}
                    y={0}
                    width={100}
                    height={66}
                >
                    <Path
                        d='M96 0.459961H4C1.79086 0.459961 0 2.25082 0 4.45996V61.54C0 63.7491 1.79086 65.54 4 65.54H96C98.2091 65.54 100 63.7491 100 61.54V4.45996C100 2.25082 98.2091 0.459961 96 0.459961Z'
                        fill='white'
                    />
                </Mask>
                <G mask='url(#mask0_1_4)'>
                    <Path
                        d='M19 0.459961H0V65.54H19V0.459961Z'
                        fill='#222633'
                    />
                    <Path
                        d='M13.5733 10.6177H2.90215C2.34026 10.6177 1.88477 11.0732 1.88477 11.6351C1.88477 12.1969 2.34026 12.6524 2.90215 12.6524H13.5733C14.1352 12.6524 14.5906 12.1969 14.5906 11.6351C14.5906 11.0732 14.1352 10.6177 13.5733 10.6177Z'
                        fill='#4B516E'
                    />
                    <Path
                        d='M15.3561 4.51331H3.58466C2.74184 4.51331 2.05859 5.19655 2.05859 6.03938C2.05859 6.8822 2.74184 7.56544 3.58466 7.56544H15.3561C16.1989 7.56544 16.8821 6.8822 16.8821 6.03938C16.8821 5.19655 16.1989 4.51331 15.3561 4.51331Z'
                        fill='#3E435B'
                    />
                    <Path
                        d='M13.5733 13.6698H2.90215C2.34026 13.6698 1.88477 14.1253 1.88477 14.6872C1.88477 15.2491 2.34026 15.7046 2.90215 15.7046H13.5733C14.1352 15.7046 14.5906 15.2491 14.5906 14.6872C14.5906 14.1253 14.1352 13.6698 13.5733 13.6698Z'
                        fill='#4B516E'
                    />
                    <Path
                        d='M100 0.459961H19V65.54H100V0.459961Z'
                        fill='white'
                    />
                    <Path
                        d='M92.293 11.46H25.293C23.9123 11.46 22.793 12.5792 22.793 13.96C22.793 15.3407 23.9123 16.46 25.293 16.46H92.293C93.6737 16.46 94.793 15.3407 94.793 13.96C94.793 12.5792 93.6737 11.46 92.293 11.46Z'
                        fill='#F5F5F5'
                    />
                    <Path
                        d='M93.1912 17.46H24.8565C23.7168 17.46 22.793 18.3838 22.793 19.5235C22.793 20.6631 23.7168 21.5869 24.8565 21.5869H93.1912C94.3308 21.5869 95.2547 20.6631 95.2547 19.5235C95.2547 18.3838 94.3308 17.46 93.1912 17.46Z'
                        fill='#F5F5F5'
                    />
                    <Path
                        d='M93.1912 22.5869H24.8565C23.7168 22.5869 22.793 23.5108 22.793 24.6504C22.793 25.79 23.7168 26.7139 24.8565 26.7139H93.1912C94.3308 26.7139 95.2547 25.79 95.2547 24.6504C95.2547 23.5108 94.3308 22.5869 93.1912 22.5869Z'
                        fill='#F5F5F5'
                    />
                    <Path
                        d='M19 6.20996H100'
                        stroke='#E0E0E0'
                        strokeWidth={0.5}
                    />
                </G>
            </G>
            <Defs>
                <ClipPath id='clip0_1_4'>
                    <Rect
                        y={0.459961}
                        width={100}
                        height={66}
                        fill='white'
                    />
                </ClipPath>
            </Defs>
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

export default LightTile;
