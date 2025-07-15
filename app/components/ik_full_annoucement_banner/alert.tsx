// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent() {
    return (
        <Svg
            width={16}
            height={16}
            viewBox='0 0 16 16'
            fill='none'
        >
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M1.54 16h12.987c.268 0 .536-.067.737-.2.2-.134.401-.334.535-.534s.201-.467.201-.734c0-.267 0-.534-.134-.734L9.506.918C9.372.65 9.172.45 8.904.25a1.757 1.757 0 00-1.808 0c-.268.134-.468.4-.602.668l-6.36 12.88c-.067.2-.134.467-.134.734 0 .267.067.534.268.734.134.2.335.4.535.534.201.133.469.2.737.2zm6.043-3.874a.75.75 0 11.834 1.248.75.75 0 01-.834-1.248zM8.5 5.5a.5.5 0 00-1 0v5a.5.5 0 001 0v-5z'
                fill='#D71E04'
            />
        </Svg>
    );
}

export default SvgComponent;
