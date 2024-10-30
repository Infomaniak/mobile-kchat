// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
    theme: Theme;
    color?: string;
}

function TranscriptIcon({theme, color}: Props) {
    const fillColor = color || theme.centerChannelColor;

    return (
        <Svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
        >
            <Path
                d='M17.5 5.00004V3.33337H2.5V5.00004H17.5Z'
                fill={fillColor}
            />
            <Path
                d='M9.58333 13.3334H2.5V11.6667H9.58333V13.3334Z'
                fill={fillColor}
            />
            <Path
                d='M17.5 9.16671H2.5V7.50004H17.5V9.16671Z'
                fill={fillColor}
            />
            <Path
                d='M13.1167 13.95L14.1667 11.6667L15.2083 13.95L17.5 15L15.2083 16.0417L14.1667 18.3334L13.1167 16.0417L10.8333 15L13.1167 13.95Z'
                fill={fillColor}
            />
        </Svg>
    );
}

export default TranscriptIcon;
