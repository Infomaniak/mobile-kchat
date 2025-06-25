import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * Indicates the className that needs to be applied.
    */
    className: string;
    /**
     * Flag signaling if the device status is visible or not.
     */
    deviceStatusVisible: boolean;
    /**
     * Flag signaling the visibility of camera preview.
     */
    showCameraPreview: boolean;
    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack?: Object;
}
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-i18next").Omit<IProps, keyof WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof WithTranslation>, "videoTrack" | "deviceStatusVisible" | "showCameraPreview"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof WithTranslation> & {
    children?: React.ReactNode;
}, "videoTrack" | "deviceStatusVisible" | "showCameraPreview">>;
export default _default;
