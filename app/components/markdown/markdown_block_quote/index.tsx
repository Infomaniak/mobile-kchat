// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ReactNode} from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';

type MarkdownBlockQuoteProps = {
    children: ReactNode | ReactNode[];
    blockQuoteContainerStyle?: ViewStyle;
};

const style = StyleSheet.create({
    blockQuoteContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
});

const MarkdownBlockQuote = ({children, blockQuoteContainerStyle}: MarkdownBlockQuoteProps) => {

    return (
        <View
            style={[style.blockQuoteContainer, blockQuoteContainerStyle]}
            testID='markdown_block_quote'
        >
            {children}
        </View>
    );
};

export default MarkdownBlockQuote;
