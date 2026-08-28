// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';

import {Screens} from '@constants';
import {useIsTablet} from '@hooks/device';
import BottomSheet from '@screens/bottom_sheet';

// import ReactForMe from '../post_options/options/ai_options/react_for_me';
import SummarizeThread from '../post_options/options/ai_options/summarize_thread';

type Props = {
    postId: string;
};

const POST_AI_BUTTON = 'close-ai-options';

const AiOptions = (props: Props) => {
    const {postId} = props;

    const isTablet = useIsTablet();
    const Scroll = useMemo(() => (isTablet ? ScrollView : BottomSheetScrollView), [isTablet]);
    const snapPoints = [1, '15%', '90%'];

    const renderContent = () => {
        return (
            <Scroll bounces={false}>
                <SummarizeThread
                    postId={postId}
                />
                {/*React for me feature is disabled for the moment*/}
                {/* <ReactForMe
                    postId={postId}
                /> */}
            </Scroll>
        );
    };

    return (
        <BottomSheet
            renderContent={renderContent}
            closeButtonId={POST_AI_BUTTON}
            componentId={Screens.AI_OPTIONS}
            initialSnapIndex={1}
            snapPoints={snapPoints}
        />
    );
};

export default AiOptions;
