import React from 'react';
import AbstractStartLiveStreamDialog, { IProps } from '../AbstractStartLiveStreamDialog';
/**
 * A React Component for requesting a YouTube stream key to use for live
 * streaming of the current conference.
 */
declare class StartLiveStreamDialog extends AbstractStartLiveStreamDialog<IProps> {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Starts live stream session and goes back to the previous screen.
     *
     * @returns {void}
     */
    _onStartPress(): void;
    /**
     * Implements {@code Component}'s render.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to handle stream key changes.
     *
     * FIXME: This is a temporary method to store the streaming key on mobile
     * for easier use, until the Google sign-in is implemented. We don't store
     * the key on web for security reasons (e.g. We don't want to have the key
     * stored if the used signed out).
     *
     * @private
     * @param {string} streamKey - The new key value.
     * @returns {void}
     */
    _onStreamKeyChangeNative(streamKey: string): void;
    /**
     * Callback to be invoked when the user selects a stream from the picker.
     *
     * @private
     * @param {string} streamKey - The key of the selected stream.
     * @returns {void}
     */
    _onStreamKeyPick(streamKey: string): void;
    /**
     * A callback to be invoked when an authenticated user changes, so
     * then we can get (or clear) the YouTube stream key.
     *
     * TODO: Handle errors by showing some indication to the user.
     *
     * @private
     * @param {Object} response - The retrieved signin response.
     * @returns {void}
     */
    _onUserChanged(response: Object): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StartLiveStreamDialog> & IProps, "dispatch" | "_conference" | "_googleAPIState" | "_googleProfileEmail" | "_streamKey">, keyof import("react-i18next").WithTranslation>>;
export default _default;
