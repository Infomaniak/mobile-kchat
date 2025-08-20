// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getSdkBundlePath} from '@jitsi/react-native-sdk/react/features/app/functions.native';
import {translate} from '@jitsi/react-native-sdk/react/features/base/i18n/functions';
import {DEFAULT_ICON as JitsiIcon} from '@jitsi/react-native-sdk/react/features/base/icons/svg/constants';
import {Audio} from '@jitsi/react-native-sdk/react/features/base/media/components/index.native';
import {combineStyles} from '@jitsi/react-native-sdk/react/features/base/styles/functions.any';
import {type Styles as AbstractToolboxItemStyles} from '@jitsi/react-native-sdk/react/features/base/toolbox/components/AbstractToolboxItem';
import ToolboxItem from '@jitsi/react-native-sdk/react/features/base/toolbox/components/ToolboxItem.native';
import BaseTheme from '@jitsi/react-native-sdk/react/features/base/ui/components/BaseTheme.native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {type WithTranslation} from 'react-i18next';
import {Platform, View, type ViewStyle} from 'react-native';

import {noop} from '@helpers/api/general';

import type {AudioElement} from '@jitsi/react-native-sdk/react/features/base/media/components/AbstractAudio';

const BUTTON_SIZE = 48;

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
    buttonStylesBorderless: {
        iconStyle: {
            color: BaseTheme.palette.icon01,
            fontSize: 24,
        },
        style: {
            flexDirection: 'row',
            justifyContent: 'center',
            margin: BaseTheme.spacing[3],
            height: 24,
            width: 24,
        },
        underlayColor: 'transparent',
    },

    /* Disabled buttons */
    disabledButtonStyles: {
        iconStyle: {opacity: 0.5},
        labelStyle: {opacity: 0.5},
        style: undefined,
        underlayColor: undefined,
    },

    /* Toggled buttons */
    toggledButtonStyles: {
        iconStyle: {
            alignSelf: 'center',
            fontSize: 24,
            color: BaseTheme.palette.icon01,
        },
        labelStyle: undefined,
        style: {
            borderRadius: BaseTheme.shape.borderRadius,
            borderWidth: 0,
            flex: 0,
            flexDirection: 'row',
            height: BUTTON_SIZE,
            justifyContent: 'center',
            marginHorizontal: 4,
            marginVertical: 4,
            width: BUTTON_SIZE,
        },
        underlayColor: 'transparent',
    },

    /* Hangup button */
    hangupButtonStyles: {
        iconStyle: {
            alignSelf: 'center',
            fontSize: 24,
            color: BaseTheme.palette.icon01,
        },
        style: {
            borderRadius: BaseTheme.shape.borderRadius,
            borderWidth: 0,
            flex: 0,
            flexDirection: 'row',
            height: BUTTON_SIZE,
            justifyContent: 'center',
            marginHorizontal: 6,
            marginVertical: 6,
            width: BUTTON_SIZE,

            // backgroundColor: schemeColor('hangup'),
            backgroundColor: 'rgb(227,79,86)',
        },
        underlayColor: BaseTheme.palette.ui04,
    },
};

// HOOKS
const useButtonStyles = (style: AbstractToolboxItemStyles, isToggled: boolean, isDisabled: boolean) => useMemo(() => {
    const buttonStyles = (isToggled ? styles.toggledButtonStyles : style) || style;

    if (isDisabled && buttonStyles && styles.disabledButtonStyles) {
        return {
            iconStyle: combineStyles(buttonStyles.iconStyle ?? {}, styles.disabledButtonStyles.iconStyle ?? {}),
            labelStyle: combineStyles(buttonStyles.labelStyle ?? {}, styles.disabledButtonStyles.labelStyle ?? {}),
            style: combineStyles(buttonStyles.style ?? {}, styles.disabledButtonStyles.style ?? {}),
            underlayColor: styles.disabledButtonStyles.underlayColor || buttonStyles.underlayColor,
        };
    }

    return buttonStyles;
}, [style, isToggled, isDisabled]);

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

export const AudioMuteButton = translate((
    {audioMuted, disabled, onPress, ...props}:
    {audioMuted: boolean; disabled: boolean; onPress: ToolboxItem['props']['onClick']} & WithTranslation,
) => {
    const buttonStyles = useButtonStyles(styles.buttonStylesBorderless, audioMuted, disabled);

    return (
        <ToolboxItem
            disabled={disabled}
            toggled={audioMuted}

            onClick={onPress}

            label={audioMuted ? 'toolbar.unmute' : 'toolbar.mute'}
            labelProps={undefined}
            accessibilityLabel={audioMuted ? 'toolbar.accessibilityLabel.unmute' : 'toolbar.accessibilityLabel.mute'}
            tooltip={audioMuted ? 'toolbar.unmute' : 'toolbar.mute'}

            elementAfter={null}
            icon={audioMuted ? JitsiIcon.IconMicSlash : JitsiIcon.IconMic}
            styles={buttonStyles}

            {...props}
        />
    );
});

export const VideoMuteButton = translate((
    {videoMuted, disabled, onPress, ...props}:
    {videoMuted: boolean; disabled: boolean; onPress: ToolboxItem['props']['onClick']} & WithTranslation,
) => {
    const buttonStyles = useButtonStyles(styles.buttonStylesBorderless, videoMuted, disabled);

    return (
        <ToolboxItem
            disabled={disabled}
            toggled={videoMuted}

            onClick={onPress}

            label={videoMuted ? 'toolbar.videounmute' : 'toolbar.videomute'}
            labelProps={undefined}
            accessibilityLabel={videoMuted ? 'toolbar.accessibilityLabel.videounmute' : 'toolbar.accessibilityLabel.videomute'}
            tooltip={videoMuted ? 'toolbar.videounmute' : 'toolbar.videomute'}

            elementAfter={null}
            icon={videoMuted ? JitsiIcon.IconVideoOff : JitsiIcon.IconVideo}
            styles={buttonStyles}

            {...props}
        />
    );
});

export const HangupButton = translate((
    {onPress, ...props}:
    {onPress: ToolboxItem['props']['onClick']} & WithTranslation,
) => (
    <ToolboxItem
        onClick={onPress}

        label={'toolbar.hangup'}
        labelProps={undefined}
        accessibilityLabel={'toolbar.accessibilityLabel.hangup'}
        tooltip={'toolbar.hangup'}

        elementAfter={null}
        icon={JitsiIcon.IconHangup}
        styles={styles.hangupButtonStyles}

        {...props}
    />
));

export const Sound = (
    {play = true, soundName = 'outgoingRinging.mp3'}:
    { play: boolean; soundName?: string },
) => {
    const audioElementRef = useRef<AudioElement>();

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
    }, []);

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
    }, [play]);

    /* Load the audio file */
    return (
        <Audio
            setRef={setRef}
            src={`${soundsPath}/${soundName}`}
            loop={true}
        />
    );
};
