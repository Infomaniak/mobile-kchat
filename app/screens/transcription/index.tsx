// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo, type FC} from 'react';
import {Animated, ScrollView, Text, View} from 'react-native';

import FormattedText from '@app/components/formatted_text';
import {Screens} from '@app/constants';
import {bottomSheetSnapPoint} from '@app/utils/helpers';
import {useTheme} from '@context/theme';
import BottomSheet from '@screens/bottom_sheet';

import {getStyleSheet} from './styles';

import type {TranscriptData} from '@typings/database/models/servers/transcript';

type Props = {
    closeButtonId: string;
    transcriptDatas: TranscriptData;
}

const Transcription: FC<Props> = ({closeButtonId, transcriptDatas}) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const ITEM_HEIGHT = 50;
    const bottom = 50;

    const snapPoints = useMemo(() => {
        const items: Array<string | number> = [1];
        const segmentsCount = transcriptDatas.segments.length;

        items.push(bottomSheetSnapPoint(segmentsCount, ITEM_HEIGHT, bottom) + 50);
        return items;
    }, [transcriptDatas]);

    const renderContent = () => {
        return (
            <>
                <FormattedText
                    style={styles.title}
                    id={'mobile.vocals.transcript_title'}
                    defaultMessage='Audio Transcript (auto-generated)'
                />
                <View
                    style={styles.separator}
                />
                <Animated.View >
                    <ScrollView
                        keyboardShouldPersistTaps={'always'}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        {transcriptDatas.segments.map((segment, index) => {
                            const minutes = Math.floor(segment.start / 60);
                            const seconds = Math.floor(segment.start % 60);
                            const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                            return (
                                <View
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    style={styles.transcriptContainer}
                                >
                                    <Text
                                        style={styles.text}
                                    >
                                        <Text style={styles.time}>
                                            {time}
                                        </Text>

                                        {` ${segment.text.trim()}`}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
            </>
        );
    };
    return (
        <>
            <BottomSheet
                renderContent={renderContent}
                closeButtonId={closeButtonId}
                componentId={Screens.TRANSCRIPTION}
                initialSnapIndex={1}
                snapPoints={snapPoints}
                testID='user_profile'
            />
        </>
    );
};

export default Transcription;
