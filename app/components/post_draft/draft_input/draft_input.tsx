// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// TODO UPSTREAM : all incoming picked, check !

import React, {useCallback, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, type LayoutChangeEvent, Platform, ScrollView, View} from 'react-native';
import Permissions, {openSettings} from 'react-native-permissions';
import {type Edge, SafeAreaView} from 'react-native-safe-area-context';

import {userTyping} from '@actions/websocket/users';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {usePersistentNotificationProps} from '@hooks/persistent_notification_props';
import {openAsBottomSheet} from '@screens/navigation';
import {logInfo} from '@utils/log';
import {persistentNotificationsConfirmation} from '@utils/post';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import PostInput from '../post_input';
import QuickActions from '../quick_actions';
import RecordAction from '../record_action';
import SendAction from '../send_button';
import Typing from '../typing';
import Uploads from '../uploads';

import Header from './header';
import VoiceInput from './voice_input';

import type {PasteInputRef} from '@mattermost/react-native-paste-input';

export type Props = {
    testID?: string;
    channelId: string;
    channelType?: ChannelType;
    channelName?: string;
    rootId?: string;
    currentUserId: string;
    canShowPostPriority?: boolean;
    voiceMessageEnabled: boolean;

    // Post Props
    postPriority: PostPriority;
    updatePostPriority: (postPriority: PostPriority) => void;
    persistentNotificationInterval: number;
    persistentNotificationMaxRecipients: number;

    // Cursor Position Handler
    updateCursorPosition: React.Dispatch<React.SetStateAction<number>>;
    cursorPosition: number;

    // Send Handler
    sendMessage: (schedulingInfo?: SchedulingInfo) => Promise<void | {data?: boolean; error?: unknown}>;
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
    scheduledPostsEnabled: boolean;
}

const SAFE_AREA_VIEW_EDGES: Edge[] = ['left', 'right'];

const SCHEDULED_POST_PICKER_BUTTON = 'close-scheduled-post-picker';

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
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
        inputContainer: {
            flex: 1,
            flexDirection: 'column',
        },
        inputContentContainer: {
            alignItems: 'stretch',
            paddingTop: Platform.select({
                ios: 7,
                android: 0,
            }),
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

function DraftInput({
    testID,
    channelId,
    channelType,
    channelName,
    currentUserId,
    canShowPostPriority,
    files,
    maxMessageLength,
    rootId = '',
    value,
    uploadFileError,
    sendMessage,
    canSend,
    updateValue,
    addFiles,
    updateCursorPosition,
    cursorPosition,
    updatePostInputTop,
    postPriority,
    updatePostPriority,
    voiceMessageEnabled,
    persistentNotificationInterval,
    persistentNotificationMaxRecipients,
    setIsFocused,
    scheduledPostsEnabled,
}: Props) {
    const [recording, setRecording] = useState(false);
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const isTablet = useIsTablet();

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
    const isHandlingVoiceAttachement = files[0]?.is_voice_recording;

    const inputRef = useRef<PasteInputRef>();
    const focus = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    // Render
    const postInputTestID = `${testID}.post.input`;
    const quickActionsTestID = `${testID}.quick_actions`;
    const sendActionTestID = `${testID}.send_action`;
    const recordActionTestID = `${testID}.record_action`;

    const style = getStyleSheet(theme);

    const {persistentNotificationsEnabled, noMentionsError, mentionsList} = usePersistentNotificationProps({
        value,
        channelType,
        postPriority,
    });

    const handleSendMessage = useCallback(async (schedulingInfoParam?: SchedulingInfo) => {
        const schedulingInfo = (schedulingInfoParam && 'scheduled_at' in schedulingInfoParam) ? schedulingInfoParam : undefined;

        if (persistentNotificationsEnabled) {
            const sendMessageWithScheduledPost = () => sendMessage(schedulingInfo);
            await persistentNotificationsConfirmation(serverUrl, value, mentionsList, intl, sendMessageWithScheduledPost, persistentNotificationMaxRecipients, persistentNotificationInterval, currentUserId, channelName, channelType);
            return Promise.resolve();
        }
        return sendMessage(schedulingInfo);
    }, [persistentNotificationsEnabled, serverUrl, value, mentionsList, intl, sendMessage, persistentNotificationMaxRecipients, persistentNotificationInterval, currentUserId, channelName, channelType]);

    const handleShowScheduledPostOptions = useCallback(() => {
        if (!scheduledPostsEnabled) {
            return;
        }

        Keyboard.dismiss();
        const title = isTablet ? intl.formatMessage({id: 'scheduled_post.picker.title', defaultMessage: 'Schedule draft'}) : '';

        openAsBottomSheet({
            closeButtonId: SCHEDULED_POST_PICKER_BUTTON,
            screen: Screens.SCHEDULED_POST_OPTIONS,
            theme,
            title,
            props: {
                closeButtonId: SCHEDULED_POST_PICKER_BUTTON,
                onSchedule: handleSendMessage,
            },
        });
    }, [handleSendMessage, intl, isTablet, scheduledPostsEnabled, theme]);

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
                sendMessage={() => sendMessage(undefined)}
                testID={sendActionTestID}
                containerStyle={isHandlingVoice && style.sendVoiceMessage}
                showScheduledPostOptions={handleShowScheduledPostOptions}
                scheduledPostEnabled={scheduledPostsEnabled}
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
                    style={style.inputContainer}
                    contentContainerStyle={style.inputContentContainer}
                    keyboardShouldPersistTaps={'always'}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    pinchGestureEnabled={false}
                    overScrollMode={'never'}
                    disableScrollViewPanResponder={true}
                >
                    <Header
                        noMentionsError={noMentionsError}
                        postPriority={postPriority}
                    />

                    {recording && (
                        <VoiceInput
                            addFiles={addFiles}
                            onClose={onCloseRecording}
                            setRecording={setRecording}
                        />
                    )}

                    {!recording && !isHandlingVoiceAttachement && (
                        <PostInput
                            testID={postInputTestID}
                            channelId={channelId}
                            maxMessageLength={maxMessageLength}
                            rootId={rootId}
                            cursorPosition={cursorPosition}
                            updateCursorPosition={updateCursorPosition}
                            updateValue={updateValue}
                            value={value}
                            addFiles={addFiles}
                            sendMessage={handleSendMessage}
                            inputRef={inputRef}
                            setIsFocused={setIsFocused}
                        />
                    )}
                    <Uploads
                        currentUserId={currentUserId}
                        files={files}
                        uploadFileError={uploadFileError}
                        channelId={channelId}
                        rootId={rootId}
                    />
                    <View style={style.actionsContainer}>
                        {!isHandlingVoice &&
                            <QuickActions
                                testID={quickActionsTestID}
                                fileCount={files.length}
                                addFiles={addFiles}
                                updateValue={updateValue}
                                value={value}
                                postPriority={postPriority}
                                updatePostPriority={updatePostPriority}
                                canShowPostPriority={canShowPostPriority}
                                focus={focus}
                                channelId={channelId}
                            />
                        }
                        {!isHandlingVoice && getActionButton()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

export default DraftInput;
