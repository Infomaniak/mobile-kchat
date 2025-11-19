// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ReactNode} from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';

type MarkdownBlockQuoteProps = {
    children: ReactNode | ReactNode[];
    containerStyle?: ViewStyle;
};

const style = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    childContainer: {
        flex: 1,
    },
    icon: {
        width: 23,
    },
});

const MarkdownBlockQuote = ({children, containerStyle}: MarkdownBlockQuoteProps) => {

    return (
        <View
            style={style.container}
            testID='markdown_block_quote'
        >
            <View
                style={[style.container, containerStyle]}
                testID='markdown_block_quote'
            >
                {children}
            </View>
        </View>
    );
};

export default MarkdownBlockQuote;
