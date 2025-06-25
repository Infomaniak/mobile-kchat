import React from 'react';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link RemoteControlAuthorizationDialog}.
 */
export interface IProps {
    /**
     * The display name of the participant who is requesting authorization for
     * remote desktop control session.
     */
    _displayName: string;
    _isScreenSharing: boolean;
    _sourceType: string;
    /**
     * Used to show/hide the dialog on cancel.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the participant who is requesting authorization for remote
     * desktop control session.
     */
    participantId: string;
    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
