// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import CompassIcon from '@components/compass_icon';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

type Props = {
    onPress: () => void;
    testID: string;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        recordButtonContainer: {
            backgroundColor: theme.buttonBg,
            borderRadius: 4,
            height: 32,
            minWidth: 60,
            alignItems: 'center',
            justifyContent: 'center',

        },
    };
});

function RecordButton({onPress, testID}: Props) {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    return (
        <TouchableWithFeedback
            onPress={onPress}
            style={styles.recordButtonContainer}
            testID={testID}
            type={'opacity'}
        >
            <CompassIcon
                color={'#ffff'}
                name='microphone'
                size={24}
            />
        </TouchableWithFeedback>
    );
}

export default RecordButton;
