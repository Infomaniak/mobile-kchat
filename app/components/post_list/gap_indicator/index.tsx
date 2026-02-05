// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';

import {fetchPosts} from '@actions/remote/post';
import FormattedText from '@components/formatted_text';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {MM_TABLES} from '@constants/database';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import DatabaseManager from '@database/manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type PostsInChannelModel from '@typings/database/models/servers/posts_in_channel';

const {POSTS_IN_CHANNEL} = MM_TABLES.SERVER;

type GapIndicatorProps = {
    channelId: string;
    testID?: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: 8,
            paddingHorizontal: 16,
        },
        line: {
            flex: 1,
            height: 1,
            backgroundColor: theme.linkColor,
            opacity: 0.3,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: changeOpacity(theme.linkColor, 0.08),
            borderRadius: 4,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginHorizontal: 8,
        },
        text: {
            color: theme.linkColor,
            ...typography('Body', 75, 'SemiBold'),
        },
        loadingContainer: {
            marginRight: 8,
        },
    };
});

const GapIndicator = ({channelId, testID}: GapIndicatorProps) => {
    const theme = useTheme();
    const serverUrl = useServerUrl();
    const styles = getStyleSheet(theme);
    const [loading, setLoading] = useState(false);

    const handlePress = useCallback(async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            // Fix for https://github.com/mattermost/mattermost-mobile/issues/9103
            // First, remove any empty chunks (earliest === latest) that cause gaps
            // This allows fetchPosts to create a proper chunk that will merge correctly
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

            await database.write(async () => {
                const chunks = await database.
                    get<PostsInChannelModel>(POSTS_IN_CHANNEL).
                    query(Q.where('channel_id', channelId)).
                    fetch();

                // Delete empty chunks (earliest === latest)
                const emptyChunks = chunks.filter((c) => c.earliest === c.latest);
                await database.batch(
                    ...emptyChunks.map((c) => c.prepareDestroyPermanently()),
                );
            });

            // Now fetch posts - this will create a new chunk that should merge with existing ones
            await fetchPosts(serverUrl, channelId);
        } finally {
            setLoading(false);
        }
    }, [loading, serverUrl, channelId]);

    return (
        <View
            style={styles.container}
            testID={testID}
        >
            <View style={styles.line}/>
            <TouchableWithFeedback
                onPress={handlePress}
                type='opacity'
                disabled={loading}
            >
                <View style={styles.button}>
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size='small'
                                color={theme.linkColor}
                            />
                        </View>
                    )}
                    <FormattedText
                        id='gap_indicator.load_more'
                        defaultMessage='Load more messages'
                        style={styles.text}
                    />
                </View>
            </TouchableWithFeedback>
            <View style={styles.line}/>
        </View>
    );
};

export default React.memo(GapIndicator);
