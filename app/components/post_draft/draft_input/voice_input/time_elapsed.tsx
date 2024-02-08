// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {Text} from 'react-native';

type TimeElapsedProps = {
    time: string;
};

const TimeElapsed = ({time = '00:00'}: TimeElapsedProps) => {
    return (
        <Text style={[{marginLeft: 12}]}>
            {time}
        </Text>
    );
};

export default TimeElapsed;
