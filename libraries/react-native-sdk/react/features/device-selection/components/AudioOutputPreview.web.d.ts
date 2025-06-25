import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link AudioOutputPreview}.
 */
export interface IProps extends WithTranslation {
    /**
     * Button className.
     */
    className?: string;
    /**
     * The device id of the audio output device to use.
     */
    deviceId: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
