// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {Path, type SvgProps} from 'react-native-svg';

function SvgComponent(props: SvgProps) {
    return (
        <Svg
            width={25}
            height={24}
            viewBox='0 0 25 24'
            fill='none'
            {...props}
        >
            <Path
                d='M12.902 0a12 12 0 110 24 12 12 0 010-24zm0 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zm0 4.501a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5a.75.75 0 01.75-.75z'
                fill='#666'
            />
        </Svg>
    );
}

export default SvgComponent;
