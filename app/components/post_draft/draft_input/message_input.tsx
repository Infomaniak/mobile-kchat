// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import PostInput from '../post_input';
import Uploads from '../uploads';

import type {PasteInputRef} from '@mattermost/react-native-paste-input';

type Props = {
    testID?: string;
    channelId: string;
    rootId?: string;
    currentUserId: string;

    // Cursor Position Handler
    updateCursorPosition: (pos: number) => void;
    cursorPosition: number;

    // Send Handler
    sendMessage: () => void;
    maxMessageLength: number;

    // Draft Handler
    addFiles: (files: FileInfo[]) => void;
    files: FileInfo[];
    inputRef: React.MutableRefObject<PasteInputRef | undefined>;
    setIsFocused: (isFocused: boolean) => void;
    uploadFileError: React.ReactNode;
    updateValue: (value: string) => void;
    value: string;
}

export default function MessageInput({
    addFiles,
    channelId,
    currentUserId,
    cursorPosition,
    files,
    inputRef,
    maxMessageLength,
    rootId = '',
    sendMessage,
    setIsFocused,
    testID,
    updateCursorPosition,
    updateValue,
    uploadFileError,
    value,
}: Props) {
    // Render
    const postInputTestID = `${testID}.post.input`;
    const isHandlingVoice = files[0]?.is_voice_recording;

    return (
        <>
            {!isHandlingVoice && (
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
                    sendMessage={sendMessage}
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
        </>
    );
}
