// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getSdkBundlePath} from '@jitsi/react-native-sdk/react/features/app/functions.native';
import {Audio} from '@jitsi/react-native-sdk/react/features/base/media/components/index.native';
import BaseTheme from '@jitsi/react-native-sdk/react/features/base/ui/components/BaseTheme.native';
import React, {useCallback, useEffect, useRef} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Platform, Pressable, View, type ViewStyle} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {noop} from '@helpers/api/general';

import type {AudioElement} from '@jitsi/react-native-sdk/react/features/base/media/components/AbstractAudio';

const BUTTON_SIZE = 48;

const messages = defineMessages({
    mute: {id: 'mobile.calls_mute', defaultMessage: 'Mute'},
    unmute: {id: 'mobile.calls_unmute', defaultMessage: 'Unmute'},
    turnCameraOn: {id: 'mobile.calls_turn_camera_on', defaultMessage: 'Turn camera on'},
    turnCameraOff: {id: 'mobile.calls_turn_camera_off', defaultMessage: 'Turn camera off'},
    leaveCall: {id: 'mobile.calls_leave_call', defaultMessage: 'Leave call'},
});

// STYLES
const styles = {

    /* Outter container */
    contentContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme.palette.uiBackground,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 1,
    } as ViewStyle,

    contentContainerWide: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        left: '50%',
        padding: BaseTheme.spacing[3],
        position: 'absolute',
        width: '50%',
    } as ViewStyle,

    /* Inner container */
    toolboxContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme.palette.ui01,
        borderRadius: BaseTheme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        marginBottom: BaseTheme.spacing[3],
        paddingHorizontal: BaseTheme.spacing[2],
        width: 180,
    } as ViewStyle,

    /* Borderless buttons */
    borderlessButton: {
        alignItems: 'center',
        height: 24,
        justifyContent: 'center',
        margin: BaseTheme.spacing[3],
        width: 24,
    } as ViewStyle,

    /* Toggled buttons */
    toggledButton: {
        alignItems: 'center',
        borderRadius: BaseTheme.shape.borderRadius,
        height: BUTTON_SIZE,
        justifyContent: 'center',
        marginHorizontal: 4,
        marginVertical: 4,
        width: BUTTON_SIZE,
    } as ViewStyle,

    /* Hangup button */
    hangupButton: {
        alignItems: 'center',
        backgroundColor: 'rgb(227,79,86)',
        borderRadius: BaseTheme.shape.borderRadius,
        height: BUTTON_SIZE,
        justifyContent: 'center',
        marginHorizontal: 6,
        marginVertical: 6,
        width: BUTTON_SIZE,
    } as ViewStyle,

    /* Pressed feedback */
    buttonPressed: {
        opacity: 0.72,
    },

    /* Disabled buttons */
    buttonDisabled: {
        opacity: 0.5,
    },
};

// COMPONENTS
export const ContentContainer = ({aspectRatio, ...props}: {aspectRatio?: 'narrow' | 'wide'} & View['props']) => (
    <View
        style={aspectRatio === 'wide' ? styles.contentContainerWide : styles.contentContainer}
        {...props}
    />
);

export const ToolboxContainer = (props: View['props']) => (
    <View
        style={styles.toolboxContainer}
        {...props}
    />
);

export const AudioMuteButton = (
    {audioMuted, disabled, onPress}:
    {audioMuted: boolean; disabled: boolean; onPress: () => void},
) => {
    const {formatMessage} = useIntl();

    return (
        <Pressable
            accessibilityLabel={formatMessage(audioMuted ? messages.unmute : messages.mute)}
            accessibilityRole='button'
            accessibilityState={{selected: audioMuted}}
            disabled={disabled}
            onPress={onPress}
            style={({pressed}) => [audioMuted ? styles.toggledButton : styles.borderlessButton, pressed && styles.buttonPressed, disabled && styles.buttonDisabled]}
        >
            <CompassIcon
                color={BaseTheme.palette.icon01}
                name={audioMuted ? 'microphone-off' : 'microphone'}
                size={24}
            />
        </Pressable>
    );
};

export const VideoMuteButton = (
    {videoMuted, disabled, onPress}:
    {videoMuted: boolean; disabled: boolean; onPress: () => void},
) => {
    const {formatMessage} = useIntl();

    return (
        <Pressable
            accessibilityLabel={formatMessage(videoMuted ? messages.turnCameraOn : messages.turnCameraOff)}
            accessibilityRole='button'
            accessibilityState={{selected: videoMuted}}
            disabled={disabled}
            onPress={onPress}
            style={({pressed}) => [videoMuted ? styles.toggledButton : styles.borderlessButton, pressed && styles.buttonPressed, disabled && styles.buttonDisabled]}
        >
            <CompassIcon
                color={BaseTheme.palette.icon01}
                name={videoMuted ? 'video-off-outline' : 'video-outline'}
                size={24}
            />
        </Pressable>
    );
};

export const HangupButton = (
    {onPress}:
    {onPress: () => void},
) => {
    const {formatMessage} = useIntl();

    return (
        <Pressable
            accessibilityLabel={formatMessage(messages.leaveCall)}
            accessibilityRole='button'
            onPress={onPress}
            style={({pressed}) => [styles.hangupButton, pressed && styles.buttonPressed]}
        >
            <CompassIcon
                color={BaseTheme.palette.icon01}
                name='phone-hangup'
                size={24}
            />
        </Pressable>
    );
};

export const Sound = (
    {play = true, soundName = 'outgoingRinging.mp3'}:
    { play: boolean; soundName?: string },
) => {
    const audioElementRef = useRef<AudioElement | undefined>(undefined);

    const playSound = useCallback(() => {
        if (typeof audioElementRef.current !== 'undefined') {
            audioElementRef.current?.play();
        }
    }, []);

    const stopSound = useCallback(() => {
        if (typeof audioElementRef.current !== 'undefined') {
            audioElementRef.current?.stop();
        }
    }, []);

    /**
     * setRef is triggered by {@link AbstractAudio}
     * when the audio file has been loaded
     */
    const setRef = useCallback((audioElement: AudioElement) => {
        audioElementRef.current = audioElement;
        if (play) {
            playSound();
        }
    }, [play, playSound]);

    const soundsPath = Platform.OS === 'ios' ? getSdkBundlePath() : 'asset:/sounds';

    useEffect(() => {
        if (play) {
            const interval = setTimeout(playSound, 100);
            return () => {
                clearTimeout(interval);
                stopSound();
            };
        }
        return noop;
    }, [play, playSound, stopSound]);

    /* Load the audio file */
    return (
        <Audio
            setRef={setRef}
            src={`${soundsPath}/${soundName}`}
            loop={true}
        />
    );
};
