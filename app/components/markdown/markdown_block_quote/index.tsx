// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ReactNode} from 'react';
import {View, type ViewStyle} from 'react-native';

type MarkdownBlockQuoteProps = {
    children: ReactNode | ReactNode[];
    blockQuoteContainerStyle?: ViewStyle;
};

const MarkdownBlockQuote = ({children, blockQuoteContainerStyle}: MarkdownBlockQuoteProps) => {

    return (
        <View
            style={[blockQuoteContainerStyle]}
            testID='markdown_block_quote'
        >
            {children}
        </View>
    );
};

export default MarkdownBlockQuote;
