// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {type SvgProps, Path, Mask, G} from 'react-native-svg';
const SvgComponent = (props: SvgProps) => (
    <Svg
        width={18}
        height={18}
        viewBox='0 0 16 16'
        fill='none'
        {...props}
    >
        <Path
            opacity={0.5}
            fillRule='evenodd'
            clipRule='evenodd'
            d='M4.44434 0.870467C4.44434 0.285211 5.02303 -0.133056 5.59463 0.0390593L15.3724 2.98325C15.7454 3.09555 15.9999 3.43278 15.9999 3.81466V11.998C15.9999 12.5832 15.4212 13.0015 14.8496 12.8294L5.07182 9.88519C4.69884 9.77288 4.44434 9.43566 4.44434 9.05378V0.870467Z'
            fill='#FF9ABF'
        />
        <Path
            opacity={0.8}
            fillRule='evenodd'
            clipRule='evenodd'
            d='M2.22266 2.26109C2.22266 1.67584 2.80135 1.25757 3.37295 1.42968L13.1507 4.37387C13.5237 4.48618 13.7782 4.8234 13.7782 5.20528V13.3886C13.7782 13.9738 13.1995 14.3921 12.6279 14.22L2.85014 11.2758C2.47717 11.1635 2.22266 10.8263 2.22266 10.4444V2.26109Z'
            fill='#F789B2'
        />
        <Path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0 4.00328C0 3.41802 0.578696 2.99976 1.1503 3.17187L10.9281 6.11606C11.301 6.22837 11.5556 6.56559 11.5556 6.94747V15.1308C11.5556 15.716 10.9769 16.1343 10.4053 15.9622L0.627479 13.018C0.254509 12.9057 0 12.5685 0 12.1866V4.00328Z'
            fill='#FF5B97'
        />
        <Mask
            id='mask0_14292_28549'

            maskUnits='userSpaceOnUse'
            x={0}
            y={3}
            width={12}
            height={13}
        >
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M0 4.00328C0 3.41802 0.578696 2.99976 1.1503 3.17187L10.9281 6.11606C11.301 6.22837 11.5556 6.56559 11.5556 6.94747V15.1308C11.5556 15.716 10.9769 16.1343 10.4053 15.9622L0.627479 13.018C0.254509 12.9057 0 12.5685 0 12.1866V4.00328Z'
                fill='white'
            />
        </Mask>
        <G mask='url(#mask0_14292_28549)'>
            <G >
                <Path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0 2.52734L11.5556 6.00684L5.74536 11.0725C5.31158 11.4507 4.62974 11.3267 4.36378 10.8212L0 2.52734Z'
                    fill='#F2357A'
                />
            </G>
        </G>
    </Svg>
);
export default SvgComponent;
