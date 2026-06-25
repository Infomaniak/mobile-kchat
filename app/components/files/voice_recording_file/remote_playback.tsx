// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, TouchableOpacity, View} from 'react-native';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {fetchPostById} from '@actions/remote/post';
import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import Loading from '@components/loading';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {observeFilesForPost} from '@queries/servers/file';
import {blendColors, makeStyleSheetFromTheme} from '@utils/theme';

import PlaybackControls from './playback_controls';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    playBackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        position: 'relative',
        width: '100%',
        borderWidth: 1,
        borderColor: blendColors(theme.centerChannelBg, theme.centerChannelColor, 0.3),
        borderRadius: 6,
        padding: 7,
        marginTop: 5,
    },
    error: {
        color: theme.centerChannelColor,
        textAlign: 'left',
        marginTop: 3,
    },
    transcriptText: {
        color: theme.centerChannelColor,
        textAlign: 'left',
        overflow: 'hidden',
        fontSize: 16,
        lineHeight: 20,
        paddingTop: 1,
    },
    openVoiceMessageButtonText: {
        fontSize: 14,
        color: theme.transcriptText,
    },
    centeredView: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    transcriptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    openVoiceMessageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
}));

type EnhanceProps = {
    post: PostModel;
}

type Props = {
    files: FileInfo[];
    currentPost: PostModel;
}

const enhance = withObservables(['post'], ({database, post}: WithDatabaseArgs & EnhanceProps) => {
    const files = observeFilesForPost(database, post.id).pipe(switchMap((items) => of$(items)));
    const currentPost = post.observe();
    return {files, currentPost};
});

const RemotePlayBack: React.FunctionComponent = ({files, currentPost}: Props) => {
    const {id = null, width = 0} = files[0] ?? {};
    const theme = useTheme();
    const intl = useIntl();
    const styles = getStyleSheet(theme);
    const serverUrl = useServerUrl();

    const [error, setError] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);

    useEffect(() => {
        if (files[0]?.transcript?.text || isLoadingTranscript) {
            return;
        }
        setIsLoadingTranscript(true);
        const handlePosts = async () => {
            try {
                await fetchPostById(serverUrl, currentPost.id);
            } catch (err) {
                setIsLoadingTranscript(false);
            }
        };
        handlePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPost.id, serverUrl]);

    useEffect(() => {
        if (files[0]?.transcript?.text) {
            setTranscript(files[0].transcript.text.trim());
        }
        setTimeout(() => {
            setIsLoadingTranscript(false);
        }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files[0]?.transcript?.text]);

    const handleLoadError = () => {
        setError(intl.formatMessage({
            id: 'mobile.vocals.load_error',
            defaultMessage: 'Your audio file could not be loaded.',
        }));
    };

    return (
        <View>
            <View style={styles.centeredView}>
                {isLoadingTranscript &&
                    <View style={styles.transcriptContainer}>
                        <Loading
                            color='#0098FF'
                            containerStyle={{marginRight: 8}}
                            size='small'
                        />
                        <Text style={styles.openVoiceMessageButtonText}>
                            <FormattedText
                                id={'mobile.vocals.transcript_loading'}
                                defaultMessage='Audio transcription in progress...'
                            />
                        </Text>
                    </View>
                }
                {!isLoadingTranscript && transcript.length > 0 &&
                    <Text style={styles.transcriptText}>{transcript}</Text>
                }
            </View>
            <TouchableOpacity
                onPress={() => setIsOpen((prev) => !prev)}
                style={styles.openVoiceMessageButton}
            >
                <CompassIcon
                    name={isOpen ? 'chevron-down' : 'chevron-right'}
                    size={15}
                    color={theme.transcriptText}
                    style={{marginTop: 1}}
                />
                <FormattedText
                    style={styles.openVoiceMessageButtonText}
                    id={'mobile.vocals.transcript.show'}
                    defaultMessage='Listen to the message'
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.playBackContainer}>
                    <PlaybackControls
                        audioId={id ?? undefined}
                        totalDuration={width}
                        onLoadError={handleLoadError}
                    />
                </View>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

export default withDatabase(enhance(RemotePlayBack));
