// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {Path, type SvgProps} from 'react-native-svg';

function SvgComponent(props: SvgProps) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
            {...props}
        >
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M2.925 5.25l7.374 5.463A2.926 2.926 0 0012 11.25c.619 0 1.216-.19 1.7-.537l7.375-5.463H2.925zm19.543.849l-7.857 5.82A4.479 4.479 0 0112 12.75a4.48 4.48 0 01-2.611-.832l-.01-.006L1.533 6.1V18c0 .187.08.375.233.518a.889.889 0 00.606.232h19.258a.889.889 0 00.606-.232.71.71 0 00.233-.518V6.099zM.708 4.397A2.438 2.438 0 012.37 3.75h19.258c.618 0 1.217.229 1.664.647.448.419.707.995.707 1.603v12c0 .608-.259 1.184-.707 1.603a2.439 2.439 0 01-1.664.647H2.371a2.438 2.438 0 01-1.664-.647A2.195 2.195 0 010 18V6c0-.608.259-1.184.707-1.603z'
                fill='#666'
            />
        </Svg>
    );
}

export default SvgComponent;
