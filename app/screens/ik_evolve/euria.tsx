// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as React from 'react';
import {Image, View} from 'react-native';

/* SVGR has dropped some elements not supported by react-native-svg: filter */

function EuriaGIF() {
    return (
        <View style={styles.container}>
            <Image
                source={require('./euria_logo.gif')}
            />
        </View>

    );
}

export default SvgComponent;
