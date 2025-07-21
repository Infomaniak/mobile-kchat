// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {G, Rect, Ellipse, Circle, Defs, ClipPath} from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent() {
    return (
        <Svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
        >
            <G filter='url(#filter0_i_10109_42546)'>
                <G clipPath='url(#clip0_10109_42546)'>
                    <Rect
                        width={24}
                        height={24}
                        rx={12}
                        fill='#0400FF'
                    />
                    <G
                        opacity={0.1}
                        filter='url(#filter1_f_10109_42546)'
                    >
                        <Ellipse
                            cx={10.1536}
                            cy={19.7581}
                            rx={8.6419}
                            ry={6.86752}
                            fill='#007EFF'
                        />
                    </G>
                    <G filter='url(#filter2_f_10109_42546)'>
                        <Circle
                            cx={12.8315}
                            cy={11.9994}
                            r={6.34708}
                            fill='#BFF8FF'
                        />
                    </G>
                    <G filter='url(#filter3_f_10109_42546)'>
                        <Circle
                            cx={9.59876}
                            cy={5.65345}
                            r={4.32142}
                            fill='#BFF8FF'
                        />
                    </G>
                    <G filter='url(#filter4_f_10109_42546)'>
                        <Ellipse
                            cx={6.2392}
                            cy={12.4496}
                            rx={4.37202}
                            ry={5.89885}
                            fill='#1715B4'
                        />
                    </G>
                    <G filter='url(#filter5_f_10109_42546)'>
                        <Ellipse
                            cx={18.2316}
                            cy={8.94857}
                            rx={5.66777}
                            ry={7.64711}
                            transform='rotate(-16.621 18.232 8.949)'
                            fill='#00E5FF'
                        />
                    </G>
                </G>
            </G>
            <Defs>
                <ClipPath id='clip0_10109_42546'>
                    <Rect
                        width={24}
                        height={24}
                        rx={12}
                        fill='#fff'
                    />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default SvgComponent;
