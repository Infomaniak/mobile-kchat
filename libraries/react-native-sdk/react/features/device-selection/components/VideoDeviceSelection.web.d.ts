import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import { type IProps as AbstractDialogTabProps } from '../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link VideoDeviceSelection}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * All known audio and video devices split by type. This prop comes from
     * the app state.
     */
    availableDevices: {
        videoInput?: MediaDeviceInfo[];
    };
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * The currently selected desktop share frame rate in the frame rate select dropdown.
     */
    currentFramerate: string;
    /**
     * All available desktop capture frame rates.
     */
    desktopShareFramerates: Array<number>;
    /**
     * True if device changing is configured to be disallowed. Selectors
     * will display as disabled.
     */
    disableDeviceChange: boolean;
    /**
     * Whether video input dropdown should be enabled or not.
     */
    disableVideoInputSelect: boolean;
    /**
     * Redux dispatch.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not the audio permission was granted.
     */
    hasVideoPermission: boolean;
    /**
     * Whether to hide the additional settings or not.
     */
    hideAdditionalSettings: boolean;
    /**
     * Whether video input preview should be displayed or not.
     * (In the case of iOS Safari).
     */
    hideVideoInputPreview: boolean;
    /**
     * Whether or not the local video is flipped.
     */
    localFlipX: boolean;
    /**
     * The id of the video input device to preview.
     */
    selectedVideoInputId: string;
}
/**
 * The type of the React {@code Component} state of {@link VideoDeviceSelection}.
 */
export interface IState {
    /**
     * The JitsiTrack to use for previewing video input.
     */
    previewVideoTrack: any | null;
    /**
     * The error message from trying to use a video input device.
     */
    previewVideoTrackError: string | null;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        flexDirection: "column";
        padding: string;
        width: string;
    };
    checkboxContainer: {
        margin: string;
    };
};
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-i18next").Omit<IProps, keyof WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof WithTranslation>, "availableDevices" | "dispatch"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof WithTranslation> & {
    children?: React.ReactNode;
}, "availableDevices" | "dispatch">>;
export default _default;
