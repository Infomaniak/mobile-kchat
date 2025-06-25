import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import { type IProps as AbstractDialogTabProps } from '../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link AudioDevicesSelection}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * All known audio and video devices split by type. This prop comes from
     * the app state.
     */
    availableDevices: {
        audioInput?: MediaDeviceInfo[];
        audioOutput?: MediaDeviceInfo[];
    };
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Whether or not the audio selector can be interacted with. If true,
     * the audio input selector will be rendered as disabled. This is
     * specifically used to prevent audio device changing in Firefox, which
     * currently does not work due to a browser-side regression.
     */
    disableAudioInputChange: boolean;
    /**
     * True if device changing is configured to be disallowed. Selectors
     * will display as disabled.
     */
    disableDeviceChange: boolean;
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not the audio permission was granted.
     */
    hasAudioPermission: boolean;
    /**
     * If true, the audio meter will not display. Necessary for browsers or
     * configurations that do not support local stats to prevent a
     * non-responsive mic preview from displaying.
     */
    hideAudioInputPreview: boolean;
    /**
     * If true, the button to play a test sound on the selected speaker will not be displayed.
     * This needs to be hidden on browsers that do not support selecting an audio output device.
     */
    hideAudioOutputPreview: boolean;
    /**
     * Whether or not the audio output source selector should display. If
     * true, the audio output selector and test audio link will not be
     * rendered.
     */
    hideAudioOutputSelect: boolean;
    /**
     * Whether or not the hid device container should display.
     */
    hideDeviceHIDContainer: boolean;
    /**
     * Whether to hide noise suppression checkbox or not.
     */
    hideNoiseSuppression: boolean;
    /**
     * Whether we are in visitors mode.
     */
    iAmVisitor: boolean;
    /**
     * Wether noise suppression is on or not.
     */
    noiseSuppressionEnabled: boolean;
    /**
     * The id of the audio input device to preview.
     */
    selectedAudioInputId: string;
    /**
     * The id of the audio output device to preview.
     */
    selectedAudioOutputId: string;
}
/**
 * The type of the React {@code Component} state of {@link AudioDevicesSelection}.
 */
export interface IState {
    /**
     * The JitsiTrack to use for previewing audio input.
     */
    previewAudioTrack?: any | null;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        flexDirection: "column";
        padding: string;
        width: string;
    };
    inputContainer: {
        marginBottom: string;
    };
    outputContainer: {
        margin: string;
        display: string;
        alignItems: string;
    };
    outputButton: {
        marginLeft: string;
    };
    noiseSuppressionContainer: {
        marginBottom: string;
    };
};
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-i18next").Omit<IProps, keyof WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof WithTranslation>, "availableDevices" | "dispatch" | "iAmVisitor"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof WithTranslation> & {
    children?: React.ReactNode;
}, "availableDevices" | "dispatch" | "iAmVisitor">>;
export default _default;
