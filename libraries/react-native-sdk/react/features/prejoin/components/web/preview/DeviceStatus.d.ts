import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The text to be displayed in relation to the status of the audio/video devices.
     */
    deviceStatusText?: string;
    /**
     * The type of status for current devices, controlling the background color of the text.
     * Can be `ok` or `warning`.
     */
    deviceStatusType?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "deviceStatusType" | "deviceStatusText">, keyof WithTranslation>>;
export default _default;
