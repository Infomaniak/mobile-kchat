// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {BottomSheetFooterProps} from '@gorhom/bottom-sheet';
import type React from 'react';

type BottomSheetState = {
    footerComponent?: React.FC<BottomSheetFooterProps>;
    renderContent?: () => React.ReactNode;
    snapPoints?: Array<number | string>;
}

class BottomSheetStoreSingleton {
    private state: BottomSheetState = {};

    clear = () => {
        this.state = {};
    };

    getState = () => this.state;

    setState = (state: BottomSheetState) => {
        this.state = state;
    };
}

const BottomSheetStore = new BottomSheetStoreSingleton();
export default BottomSheetStore;
