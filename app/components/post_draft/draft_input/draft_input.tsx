// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useRef, useState} from 'react';
import {type LayoutChangeEvent, Platform, ScrollView, View} from 'react-native';
import Permissions, {openSettings} from 'react-native-permissions';
import {type Edge, SafeAreaView} from 'react-native-safe-area-context';

import {userTyping} from '@actions/websocket/users';
import GuestBanner from '@app/components/guest_banner';
import {logInfo} from '@app/utils/log';
import QuickActions from '@components/post_draft/quick_actions';
import PostPriorityLabel from '@components/post_priority/post_priority_label';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import RecordAction from '../record_action';
import SendAction from '../send_action';
import Typing from '../typing';

import MessageInput from './message_input';
import VoiceInput from './voice_input';

import type {PasteInputRef} from '@mattermost/react-native-paste-input';

type Props = {
    testID?: string;
    channelId: string;
    rootId?: string;
    currentUserId: string;
    voiceMessageEnabled: boolean;
    canShowPostPriority?: boolean;
    serverUrl: string;

    // Post Props
    postPriority: PostPriority;
    updatePostPriority: (postPriority: PostPriority) => void;

    // Cursor Position Handler
    updateCursorPosition: React.Dispatch<React.SetStateAction<number>>;
    cursorPosition: number;

    // Send Handler
    sendMessage: () => void;
    canSend: boolean;
    maxMessageLength: number;

    // Draft Handler
    files: FileInfo[];
    value: string;
    uploadFileError: React.ReactNode;
    updateValue: React.Dispatch<React.SetStateAction<string>>;
    addFiles: (files: FileInfo[]) => void;
    updatePostInputTop: (top: number) => void;
    setIsFocused: (isFocused: boolean) => void;
}

const SAFE_AREA_VIEW_EDGES: Edge[] = ['left', 'right'];

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        inputContainer: {
            flex: 1,
            flexDirection: 'column',
        },
        inputContentContainer: {
            alignItems: 'stretch',
        },
        inputWrapper: {
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: 2,
            backgroundColor: theme.centerChannelBg,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: changeOpacity(theme.centerChannelColor, 0.20),
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'hidden',
        },
        actionsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: Platform.select({
                ios: 1,
                android: 2,
            }),
        },
        sendVoiceMessage: {
            position: 'absolute',
            right: -5,
            top: 16,
        },
        postPriorityLabel: {
            marginLeft: 12,
            marginTop: Platform.select({
                ios: 3,
                android: 10,
            }),
        },
    };
});

export default function DraftInput({
    addFiles,
    canSend,
    channelId,
    currentUserId,
    cursorPosition,
    canShowPostPriority,
    files,
    maxMessageLength,
    rootId = '',
    sendMessage,
    testID,
    updateCursorPosition,
    updatePostInputTop,
    updateValue,
    uploadFileError,
    value,
    voiceMessageEnabled,
    postPriority,
    updatePostPriority,
    setIsFocused,
    serverUrl,
}: Props) {
    const [recording, setRecording] = useState(false);
    const theme = useTheme();
    const style = getStyleSheet(theme);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        updatePostInputTop(e.nativeEvent.layout.height);
    }, []);

    const onPresRecording = useCallback(async () => {
        const permission = Platform.select({
            ios: Permissions.PERMISSIONS.IOS.MICROPHONE,
            android: Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
        });

        if (!permission) {
            logInfo('Could not select a platform');
            return;
        }

        const check = await Permissions.check(permission);

        if (check === 'blocked') {
            openSettings();
        }

        if (check === 'granted') {
            setRecording(true);
            userTyping('recording', serverUrl, channelId, rootId);
        }

        if (check === 'denied') {
            const result = await Permissions.request(permission);

            if (result === 'granted') {
                await new Promise((resolve) => setTimeout(resolve, 500));
                setRecording(true);
                userTyping('recording', serverUrl, channelId, rootId);
            }

            if (Platform.OS === 'android' && result === 'blocked') {
                openSettings();
            }
        }
    }, []);

    const onCloseRecording = useCallback(() => {
        setRecording(false);
        userTyping('stop', serverUrl, channelId, rootId);
    }, []);

    const isHandlingVoice = recording;
    const inputRef = useRef<PasteInputRef>();
    const focus = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    // Render
    const quickActionsTestID = `${testID}.quick_actions`;
    const sendActionTestID = `${testID}.send_action`;
    const recordActionTestID = `${testID}.record_action`;

    const getActionButton = useCallback(() => {
        if (value.length === 0 && files.length === 0 && voiceMessageEnabled) {
            return (
                <RecordAction
                    onPress={onPresRecording}
                    testID={recordActionTestID}
                />
            );
        }

        return (
            <SendAction
                disabled={!canSend}
                sendMessage={sendMessage}
                testID={sendActionTestID}
                containerStyle={isHandlingVoice && style.sendVoiceMessage}
            />
        );
    }, [
        canSend,
        files.length,
        onCloseRecording,
        onPresRecording,
        sendMessage,
        testID,
        value.length,
        voiceMessageEnabled,
        isHandlingVoice,
    ]);

    return (
        <>
            <Typing
                channelId={channelId}
                rootId={rootId}
                currentUserId={currentUserId}
            />
            <SafeAreaView
                edges={SAFE_AREA_VIEW_EDGES}
                onLayout={handleLayout}
                style={style.inputWrapper}
                testID={testID}
            >
                <ScrollView
                    contentContainerStyle={style.inputContentContainer}
                    disableScrollViewPanResponder={true}
                    keyboardShouldPersistTaps={'always'}
                    overScrollMode={'never'}
                    pinchGestureEnabled={false}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={style.inputContainer}
                >
                    <GuestBanner channelId={channelId}/>
                    {Boolean(postPriority?.priority) && (
                        <View style={style.postPriorityLabel}>
                            <PostPriorityLabel label={postPriority!.priority}/>
                        </View>
                    )}
                    {recording && (
                        <VoiceInput
                            addFiles={addFiles}
                            onClose={onCloseRecording}
                            setRecording={setRecording}
                        />
                    )}
                    {!recording &&
                        <MessageInput
                            addFiles={addFiles}
                            channelId={channelId}
                            currentUserId={currentUserId}
                            cursorPosition={cursorPosition}
                            files={files}
                            inputRef={inputRef}
                            maxMessageLength={maxMessageLength}
                            rootId={rootId}
                            sendMessage={sendMessage}
                            setIsFocused={setIsFocused}
                            testID={testID}
                            updateCursorPosition={updateCursorPosition}
                            updateValue={updateValue}
                            uploadFileError={uploadFileError}
                            value={value}
                        />
                    }
                    <View style={style.actionsContainer}>
                        {!isHandlingVoice &&
                            <QuickActions
                                addFiles={addFiles}
                                canShowPostPriority={canShowPostPriority}
                                fileCount={files.length}
                                postPriority={postPriority}
                                testID={quickActionsTestID}
                                updatePostPriority={updatePostPriority}
                                updateValue={updateValue}
                                value={value}
                                focus={focus}
                            />
                        }
                        {!isHandlingVoice && getActionButton()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
