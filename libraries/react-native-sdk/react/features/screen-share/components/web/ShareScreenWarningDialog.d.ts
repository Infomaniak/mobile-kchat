import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
export interface IProps extends WithTranslation {
    /**
     * Whether or not the dialog was opened for the audio screen sharing flow or the normal one.
     */
    _isAudioScreenShareWarning: Boolean;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
}
/**
 *  Component that displays the share audio helper dialog.
 */
declare class ShareScreenWarningDialog extends Component<IProps> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Stop current screen sharing session.
     *
     * @returns {boolean}
     */
    _onStopSharing(): boolean;
    /**
     * Implements {@Component#render}.
     *§.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ShareScreenWarningDialog> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
