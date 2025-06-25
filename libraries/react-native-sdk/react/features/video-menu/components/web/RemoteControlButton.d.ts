import React from 'react';
import { WithTranslation } from 'react-i18next';
export declare const REMOTE_CONTROL_MENU_STATES: {
    NOT_SUPPORTED: number;
    NOT_STARTED: number;
    REQUESTING: number;
    STARTED: number;
};
/**
 * The type of the React {@code Component} props of {@link RemoteControlButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * Callback to execute when the button is clicked.
     */
    notifyClick?: Function;
    /**
     * Notify mode for `participantMenuButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
    /**
     * The callback to invoke when the component is clicked.
     */
    onClick: (() => void) | null;
    /**
     * The ID of the participant linked to the onClick callback.
     */
    participantID: string;
    /**
     * The current status of remote control. Should be a number listed in the
     * enum REMOTE_CONTROL_MENU_STATES.
     */
    remoteControlState: number;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
