// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import FormattedText from '@components/formatted_text';
import {Events} from '@constants';
import {TYPING_HEIGHT} from '@constants/post_draft';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

type Props = {
    channelId: string;
    rootId: string;
    currentUserId: string;
}

type Action = 'typing' | 'recording';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        typing: {
            color: changeOpacity(theme.centerChannelColor, 0.7),
            paddingHorizontal: 10,
            ...typography('Body', 75),
        },
    };
});

function Typing({
    channelId,
    rootId,
    currentUserId,
}: Props) {
    const height = useSharedValue(0);
    const typing = useRef<Array<{id: string; now: number; username: string}>>([]);
    const recording = useRef<Array<{id: string; now: number; username: string}>>([]);
    const timeoutToDisappear = useRef<{ [k in Action]?: NodeJS.Timeout }>({});
    const mounted = useRef(false);
    const [refresh, setRefresh] = useState(0);

    const theme = useTheme();
    const style = getStyleSheet(theme);

    // This moves the list of post up. This may be rethought by UX in https://mattermost.atlassian.net/browse/MM-39681
    const typingAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height.value),
            marginBottom: 4,
        };
    });

    const useCreateOnUserStartAction = (action: Action) => useCallback((msg: any) => {
        if (channelId !== msg.channelId) {
            return;
        }

        const msgRootId = msg.parentId || msg.rootId || '';
        if (rootId !== msgRootId) {
            return;
        }

        if (msg.userId === currentUserId) {
            return;
        }

        const ref = action === 'typing' ? typing : recording;
        ref.current = ref.current.filter(({id}) => id !== msg.userId);
        ref.current.push({id: msg.userId, now: msg.now, username: msg.username});
        if (timeoutToDisappear.current[action]) {
            clearTimeout(timeoutToDisappear.current[action]);
            timeoutToDisappear.current[action] = undefined;
        }
        if (mounted.current) {
            setRefresh(Date.now());
        }
    }, [channelId, rootId]);
    const onUserStartTyping = useCreateOnUserStartAction('typing');
    const onUserStartRecording = useCreateOnUserStartAction('recording');

    const useCreateOnUserStopAction = (
        action: Action,
        ref: React.MutableRefObject<Array<{ id: string; now: number; username: string}>>,
    ) => useCallback((msg: any) => {
        if (channelId !== msg.channelId) {
            return;
        }

        const msgRootId = msg.parentId || msg.rootId || '';
        if (rootId !== msgRootId) {
            return;
        }

        ref.current = ref.current.filter(({id, now}) => id !== msg.userId && now !== msg.now);

        if (timeoutToDisappear.current) {
            clearTimeout(timeoutToDisappear.current[action]);
            timeoutToDisappear.current[action] = undefined;
        }

        if (ref.current.length === 0) {
            timeoutToDisappear.current[action] = setTimeout(() => {
                if (mounted.current) {
                    setRefresh(Date.now());
                }
                timeoutToDisappear.current[action] = undefined;
            }, 500);
        } else if (mounted.current) {
            setRefresh(Date.now());
        }
    }, [channelId, rootId]);
    const onUserStopTyping = useCreateOnUserStopAction('typing', typing);
    const onUserStopRecording = useCreateOnUserStopAction('recording', recording);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        const listeners = [
            DeviceEventEmitter.addListener(Events.USER_TYPING, onUserStartTyping),
            DeviceEventEmitter.addListener(Events.USER_RECORDING, onUserStartRecording),
            DeviceEventEmitter.addListener(Events.USER_STOP_TYPING, onUserStopTyping),
            DeviceEventEmitter.addListener(Events.USER_STOP_RECORDING, onUserStopRecording),
        ];
        return () => {
            for (const listener of listeners) {
                listener.remove();
            }
        };
    }, []);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(Events.USER_STOP_TYPING, onUserStopTyping);
        return () => {
            listener.remove();
        };
    }, [onUserStopTyping]);

    useEffect(() => {
        height.value = (typing.current.length + recording.current.length) ? TYPING_HEIGHT : 0;
    }, [refresh]);

    useEffect(() => {
        typing.current = [];
        recording.current = [];
        height.value = 0;
        for (const action of ['typing', 'recording'] as Action[]) {
            if (timeoutToDisappear.current[action]) {
                clearTimeout(timeoutToDisappear.current[action]);
                timeoutToDisappear.current[action] = undefined;
            }
        }
    }, [channelId, rootId, height]);

    const renderAction = (action: Action) => {
        const ref = action === 'typing' ? typing : recording;
        const nextAction = ref.current.map(({username}) => username);

        // Max three names
        nextAction.splice(3);

        const numUsers = nextAction.length;

        switch (numUsers) {
            case 0:
                return null;
            case 1:
                if (action === 'recording') {
                    return (
                        <FormattedText
                            id='msg_recording.isRecording'
                            defaultMessage='{user} record a voice message...'
                            style={style.typing}
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            values={{
                                user: nextAction[0],
                            }}
                        />
                    );
                }

                return (
                    <FormattedText
                        id='msg_typing.isTyping'
                        defaultMessage='{user} is typing...'
                        style={style.typing}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        values={{
                            user: nextAction[0],
                        }}
                    />
                );
            default: {
                const last = nextAction.pop();

                if (action === 'recording') {
                    return (
                        <FormattedText
                            id='msg_recording.areRecording'
                            defaultMessage='{users} and {last} record a voice message...'
                            style={style.typing}
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            values={{
                                users: (nextAction.join(', ')),
                                last,
                            }}
                        />
                    );
                }

                return (
                    <FormattedText
                        id='msg_typing.areTyping'
                        defaultMessage='{users} and {last} are typing...'
                        style={style.typing}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        values={{
                            users: (nextAction.join(', ')),
                            last,
                        }}
                    />
                );
            }
        }
    };

    return (
        <Animated.View style={typingAnimatedStyle}>
            {renderAction('typing') || renderAction('recording')}
        </Animated.View>
    );
}

export default React.memo(Typing);

