// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import RewritingIndicator from '@agents/components/rewriting_indicator';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, type LayoutChangeEvent, Platform, ScrollView, View} from 'react-native';
import Permissions, {openSettings} from 'react-native-permissions';
import {useAnimatedReaction} from 'react-native-reanimated';
import {type Edge, SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {scheduleOnRN} from 'react-native-worklets';

import {userTyping} from '@actions/websocket/users';
import {Screens} from '@constants';
import {isAndroidEdgeToEdge} from '@constants/device';
import {useKeyboardState} from '@context/keyboard_state';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {usePersistentNotificationProps} from '@hooks/persistent_notification_props';
import {openAsBottomSheet} from '@screens/navigation';
import CallbackStore from '@store/callback_store';
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

import type {AvailableScreens} from '@typings/screens/navigation';

export type Props = {
    testID?: string;
    channelId: string;
    channelType?: ChannelType;
    channelName?: string;
    rootId?: string;
    currentUserId: string;
    canShowPostPriority?: boolean;
    voiceMessageEnabled: boolean;
    location?: AvailableScreens;

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

const SCHEDULED_POST_PICKER_BUTTON = 'close-scheduled-post-picker';
const SAFE_AREA_VIEW_EDGES: Edge[] = ['left', 'right'];

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        actionsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: 8,
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
    const [layoutHeight, setLayoutHeight] = useState(0);
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const {bottom} = useSafeAreaInsets();

    const {inputRef, blurAndDismissKeyboard, stateContext} = useKeyboardState();

    const focus = useCallback(() => {
        inputRef.current?.focus();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        const height = e.nativeEvent.layout.height;
        setLayoutHeight(height);

        // Android edge-to-edge tracks the input top from the keyboard animation instead, see the
        // reaction below: pushing the bare height here would reset the anchor without the open
        // keyboard offset whenever the input height changes while the keyboard is open.
        if (!isAndroidEdgeToEdge) {
            updatePostInputTop(height);
        }
    }, [updatePostInputTop]);

    // On Android edge-to-edge (API 30+), the window does not resize for the keyboard: the input
    // container is translated by postInputTranslateY instead, and the autocomplete is mounted
    // through a Portal outside that translated container. The autocomplete anchor (postInputTop)
    // must therefore track the input container translation to stay above the keyboard.
    // Folds upstream's reaction (layoutHeight + translateY + 2*bottom) with the -bottom applied in
    // upstream's post_draft anchor, which this tree does not have, for the same net position.
    useAnimatedReaction(
        () => stateContext.postInputTranslateY.value,
        (translateY) => {
            if (isAndroidEdgeToEdge) {
                scheduleOnRN(updatePostInputTop, layoutHeight + translateY + bottom);
            }
        },
        [layoutHeight, updatePostInputTop, bottom, stateContext.postInputTranslateY],
    );

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
            await blurAndDismissKeyboard();
            setRecording(true);
            userTyping('recording', serverUrl, channelId, rootId);
        }

        if (check === 'denied') {
            const result = await Permissions.request(permission);

            if (result === 'granted') {
                await new Promise((resolve) => setTimeout(resolve, 500));
                await blurAndDismissKeyboard();
                setRecording(true);
                userTyping('recording', serverUrl, channelId, rootId);
            }

            if (Platform.OS === 'android' && result === 'blocked') {
                openSettings();
            }
        }
    }, [blurAndDismissKeyboard, channelId, rootId, serverUrl]);

    const onCloseRecording = useCallback(() => {
        setRecording(false);
        userTyping('stop', serverUrl, channelId, rootId);
    }, [channelId, rootId, serverUrl]);

    const isHandlingVoice = recording;
    const isHandlingVoiceAttachement = files[0]?.is_voice_recording;

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
        CallbackStore.setCallback<((schedulingInfo: SchedulingInfo) => Promise<void | {data?: boolean; error?: unknown}>)>(handleSendMessage);
        openAsBottomSheet({
            closeButtonId: SCHEDULED_POST_PICKER_BUTTON,
            screen: Screens.SCHEDULED_POST_OPTIONS,
            theme,
            title: '',
            props: {},
        });
    }, [handleSendMessage, scheduledPostsEnabled, theme]);

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
                sendMessage={handleSendMessage}
                testID={sendActionTestID}
                showScheduledPostOptions={handleShowScheduledPostOptions}
                scheduledPostEnabled={scheduledPostsEnabled}
            />
        );
    }, [value.length, files.length, voiceMessageEnabled, canSend, handleSendMessage, sendActionTestID, handleShowScheduledPostOptions, scheduledPostsEnabled, onPresRecording, recordActionTestID]);

    return (
        <>
            <RewritingIndicator/>
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
