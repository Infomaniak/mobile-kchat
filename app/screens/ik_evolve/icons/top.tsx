// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import {Dimensions} from 'react-native';
import Svg, {
    G,
    Path,
    Rect,
    Defs,
    RadialGradient,
    Stop,
    LinearGradient,
    ClipPath,
    type SvgProps,
} from 'react-native-svg';

import {useTheme} from '@context/theme';
const {width: screenWidth} = Dimensions.get('window');
function SvgComponent(props: SvgProps) {
    const theme = useTheme();
    return (
        <Svg
            width='100%'
            height={(screenWidth * 92) / 375}
            viewBox='0 0 375 92'
            fill='none'
            style={{alignSelf: 'stretch'}}
            preserveAspectRatio='none'
            {...props}
        >
            <G clipPath='url(#clip0_10109_42517)'>
                <Path
                    fill='#222633'
                    d='M0 0H375V120H0z'
                />

                <Path
                    fill='url(#paint0_radial_10109_42517)'
                    d='M0 0H375V120H0z'
                />
                <Path
                    fill='url(#paint1_radial_10109_42517)'
                    d='M0 0H375V120H0z'
                />
                <Path
                    fill='url(#paint2_radial_10109_42517)'
                    d='M0 0H375V120H0z'
                />
                <Path
                    fill='url(#paint3_radial_10109_42517)'
                    fillOpacity={0.6}
                    d='M0 0H375V120H0z'
                />

                <Path
                    fill='url(#paint4_radial_10109_42517)'
                    fillOpacity={0.5}
                    d='M0 0H375V120H0z'
                />

                <Path
                    d='M116.656 30.871v12.87l6.51-7.26h3.36l-6.15 6.69 6.99 9.45h-3.33l-5.49-7.44-1.89 2.04v5.4h-2.73v-21.75h2.73zm19.796-.39c3.9 0 7.41 1.74 8.25 5.94h-2.97c-.75-2.52-3.21-3.36-5.4-3.36-1.68 0-4.62.75-4.62 3.18 0 1.92 1.53 2.88 3.54 3.33l2.52.57c3.33.72 7.32 1.98 7.32 6.36 0 4.26-3.96 6.51-8.28 6.51-5.13 0-8.37-2.79-8.94-7.14h3c.57 3 2.67 4.56 6 4.56 3.21 0 5.07-1.53 5.07-3.66 0-2.28-1.95-3.24-4.68-3.84l-2.7-.57c-2.97-.66-5.97-2.31-5.97-5.94 0-4.14 4.35-5.94 7.86-5.94zm21.975 19.83c-.93 1.53-2.4 2.7-5.07 2.7-3.75 0-5.16-2.52-5.16-6.21v-10.32h2.73v9.51c0 2.49.42 4.65 3.39 4.65 2.58 0 4.11-1.83 4.11-5.28v-8.88h2.73v16.14h-2.73v-2.31zm9.791-19.44v3.3h-2.73v-3.3h2.73zm0 5.61v16.14h-2.73v-16.14h2.73zm5.111-4.05h2.73v4.05h3.06v2.19h-3.06v9.57c0 1.68.12 2.1 1.68 2.1h1.38v2.28h-1.98c-3.09 0-3.81-.69-3.81-4.05v-9.9h-2.55v-2.19h2.55v-4.05zm10.659 13.02c.12 3.48 2.58 5.16 4.98 5.16 2.4 0 3.72-1.08 4.41-2.67h2.82c-.75 2.79-3.3 5.07-7.23 5.07-5.1 0-7.92-3.66-7.92-8.43 0-5.1 3.42-8.37 7.83-8.37 4.92 0 7.89 4.14 7.53 9.24h-12.42zm.03-2.34h9.51c-.06-2.28-1.77-4.56-4.65-4.56-2.43 0-4.62 1.32-4.86 4.56z'
                    fill='#fff'
                />
                <Rect
                    x={217.766}
                    y={30.6211}
                    width={46}
                    height={24}
                    rx={4}
                    stroke='url(#paint5_linear_10109_42517)'
                />

                <Path
                    d='M229.965 37.921c1.788 0 3.828.252 3.828 2.88 0 2.22-1.776 2.76-3.78 2.76h-1.308v3.06h-1.716v-8.7h2.976zm-1.26 1.344v2.964h1.416c1.068 0 1.908-.264 1.908-1.416 0-1.428-1.092-1.548-2.028-1.548h-1.296zm11.488 3.948h-1.824v3.408h-1.716v-8.7h2.856c2.868 0 3.96.816 3.96 2.64 0 .996-.492 1.836-1.572 2.292l1.932 3.768h-1.908l-1.728-3.408zm-1.824-3.948v2.616h1.416c1.332 0 1.92-.456 1.92-1.308 0-1.008-.84-1.308-2.004-1.308h-1.332zm12.259 7.512c-2.592 0-4.26-1.812-4.26-4.512 0-2.7 1.668-4.5 4.26-4.5 2.592 0 4.26 1.8 4.26 4.5s-1.668 4.512-4.26 4.512zm0-1.368c1.356 0 2.484-1.104 2.484-3.144s-1.128-3.132-2.484-3.132-2.484 1.092-2.484 3.132 1.128 3.144 2.484 3.144zM0 80v40h375V80s-93.75 11.785-187.5 11.785S0 80 0 80z'
                    fill='#fff'
                />
                <Path
                    d='M0 80v40h375V80s-93.75 11.785-187.5 11.785S0 80 0 80z'
                    fill={theme.centerChannelBg}
                />

            </G>
            <Defs>
                <RadialGradient
                    id='paint0_radial_10109_42517'
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(0 -155.9 279.409 0 365 161)'
                >
                    <Stop stopColor='#FD8C3D'/>
                    <Stop
                        offset={1}
                        stopColor='#222633'
                        stopOpacity={0}
                    />
                </RadialGradient>
                <RadialGradient
                    id='paint1_radial_10109_42517'
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(0 -188.024 115.74 0 296.5 193)'
                >
                    <Stop stopColor='#F34BBB'/>
                    <Stop
                        offset={1}
                        stopColor='#222633'
                        stopOpacity={0}
                    />
                </RadialGradient>
                <RadialGradient
                    id='paint2_radial_10109_42517'
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(0 -248 205.08 0 187 250)'
                >
                    <Stop
                        offset={0.0138958}
                        stopColor='#A055FC'
                    />
                    <Stop
                        offset={1}
                        stopColor='#222633'
                        stopOpacity={0}
                    />
                </RadialGradient>
                <RadialGradient
                    id='paint3_radial_10109_42517'
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(0 -221 160.679 0 94.5 228.5)'
                >
                    <Stop stopColor='#337CFF'/>
                    <Stop
                        offset={1}
                        stopColor='#222633'
                        stopOpacity={0.5}
                    />
                </RadialGradient>
                <RadialGradient
                    id='paint4_radial_10109_42517'
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(-3.00003 -299.49998 309.0005 -3.09519 9 302)'
                >
                    <Stop stopColor='#1DDDFD'/>
                    <Stop
                        offset={1}
                        stopColor='#222633'
                        stopOpacity={0.7}
                    />
                </RadialGradient>
                <LinearGradient
                    id='paint5_linear_10109_42517'
                    x1={217.766}
                    y1={42.6211}
                    x2={263.766}
                    y2={42.6211}
                    gradientUnits='userSpaceOnUse'
                >
                    <Stop stopColor='#1DDDFD'/>
                    <Stop
                        offset={0.25}
                        stopColor='#337CFF'
                    />
                    <Stop
                        offset={0.5}
                        stopColor='#A055FC'
                    />
                    <Stop
                        offset={0.755}
                        stopColor='#F34BBB'
                    />
                    <Stop
                        offset={1}
                        stopColor='#FD8C3D'
                    />
                </LinearGradient>
                <ClipPath id='clip0_10109_42517'>
                    <Path
                        fill='#fff'
                        d='M0 0H375V92H0z'
                    />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default SvgComponent;
