import React from 'react';
import { IProps as AbstractProps } from '../AbstractLobbyScreen';
export interface IProps extends AbstractProps {
    /**
     * The current aspect ratio of the screen.
     */
    _aspectRatio: Symbol;
    /**
     * The room name.
     */
    _roomName: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
