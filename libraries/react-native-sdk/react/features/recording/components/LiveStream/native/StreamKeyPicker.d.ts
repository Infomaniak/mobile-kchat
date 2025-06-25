import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * Style of the dialogs feature.
     */
    _dialogStyles: any;
    /**
     * The list of broadcasts the user can pick from.
     */
    broadcasts?: Array<{
        key: string;
        title: string;
    }>;
    /**
     * Callback to be invoked when the user picked a broadcast. To be invoked
     * with a single key (string).
     */
    onChange: Function;
}
export interface IState {
    /**
    * The key of the currently selected stream.
    */
    streamKey?: string | null;
}
/**
 * Class to implement a stream key picker (dropdown) component to allow the user
 * to choose from the available Google Broadcasts/Streams.
 *
 * NOTE: This component is currently only used on mobile, but it is advised at
 * a later point to unify mobile and web logic for this functionality. But it's
 * out of the scope for now of the mobile live streaming functionality.
 */
declare class StreamKeyPicker extends Component<IProps, IState> {
    /**
     * Instantiates a new instance of StreamKeyPicker.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Renders the component.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Opens the link which should display the YouTube broadcast live stream
     * key.
     *
     * @private
     * @returns {void}
     */
    _onOpenYoutubeDashboard(): void;
    /**
     * Callback to be invoked when the user picks a stream from the list.
     *
     * @private
     * @param {string} streamKey - The key of the stream selected.
     * @returns {Function}
     */
    _onStreamPick(streamKey: string): () => void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StreamKeyPicker> & IProps, "_dialogStyles">, keyof WithTranslation>>;
export default _default;
