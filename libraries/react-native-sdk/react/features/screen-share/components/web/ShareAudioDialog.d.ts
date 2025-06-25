import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link ShareAudioDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * Boolean stored in local storage that determines whether or not the dialog will be displayed again.
     */
    _shouldHideShareAudioHelper: boolean;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
}
/**
 * Component that displays the audio screen share helper dialog.
 */
declare class ShareAudioDialog extends Component<IProps> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Continue the normal screen sharing flow when the user clicks continue.
     *
     * @returns {boolean}
     */
    _onContinue(): boolean;
    /**
     * Callback invoked when the hide audio helper checkbox has been selected. This setting will be persisted in
     * the local storage, thus the dialog won't be displayed again.
     *
     * @param {Object} e - The key event to handle.
     * @returns {void}
     */
    _onSelectHideShareAudioHelper({ target: { checked } }: React.ChangeEvent<HTMLInputElement>): void;
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ShareAudioDialog> & IProps, "dispatch" | "_shouldHideShareAudioHelper">, keyof WithTranslation>>;
export default _default;
