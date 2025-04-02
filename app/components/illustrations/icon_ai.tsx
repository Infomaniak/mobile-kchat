// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

import {changeOpacity} from '@utils/theme';

type Props = {
    theme: Theme;
}

function IconAI({theme}: Props) {
    return (
        <Svg
            width='39'
            height='34'
            viewBox='0 0 27 19'
            fill='none'
        >
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.50453 8.70448L5.69986 9.5999L8.50453 10.4953L9.39995 13.3L10.2954 10.4953L13.1 9.5999L10.2954 8.70448L9.39995 5.89981L8.50453 8.70448ZM7.17355 7.3735L0.199951 9.5999L7.17355 11.8263L9.39995 18.7999L11.6264 11.8263L18.6 9.5999L11.6264 7.3735L9.39995 0.399902L7.17355 7.3735Z'
                fill={changeOpacity(theme.centerChannelColor, 0.64)}
            />
            <Path
                d='M3.80005 2L3.36005 3.56L1.80005 4L3.36005 4.44L3.80005 6L4.24005 4.44L5.80005 4L4.24005 3.56L3.80005 2Z'
                fill={changeOpacity(theme.centerChannelColor, 0.64)}
            />
            <Path
                d='M15.4 12.3999L14.696 14.8959L12.2 15.5999L14.696 16.3039L15.4 18.7999L16.104 16.3039L18.6 15.5999L16.104 14.8959L15.4 12.3999Z'
                fill={changeOpacity(theme.centerChannelColor, 0.64)}
            />
        </Svg>
    );
}

export default IconAI;
