import React from 'react';
import AbstractStartLiveStreamDialog, { IProps as AbstractProps } from '../AbstractStartLiveStreamDialog';
export interface IProps extends AbstractProps {
    /**
     * The ID for the Google client application used for making stream key
     * related requests.
     */
    _googleApiApplicationClientID?: string;
}
/**
 * A React Component for requesting a YouTube stream key to use for live
 * streaming of the current conference.
 *
 * @augments Component
 */
declare class StartLiveStreamDialog extends AbstractStartLiveStreamDialog<IProps> {
    /**
     * Initializes a new {@code StartLiveStreamDialog} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code StartLiveStreamDialog} instance with.
     */
    constructor(props: IProps);
    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Implements {@code Component}'s render.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Loads the Google web client application used for fetching stream keys.
     * If the user is already logged in, then a request for available YouTube
     * broadcasts is also made.
     *
     * @private
     * @returns {void}
     */
    _onInitializeGoogleApi(): void;
    /**
     * Automatically selects the input field's value after starting to edit the
     * display name.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(previousProps: IProps): void;
    /**
     * Asks the user to sign in, if not already signed in, and then requests a
     * list of the user's YouTube broadcasts.
     *
     * @private
     * @returns {void}
     */
    _onGetYouTubeBroadcasts(): void;
    /**
     * Forces the Google web client application to prompt for a sign in, such as
     * when changing account, and will then fetch available YouTube broadcasts.
     *
     * @private
     * @returns {Promise}
     */
    _onGoogleSignIn(): void;
    /**
     * Forces the Google web client application to prompt for a sign in, such as
     * when changing account, and will then fetch available YouTube broadcasts.
     *
     * @private
     * @returns {Promise}
     */
    _onRequestGoogleSignIn(): void;
    /**
     * Fetches the stream key for a YouTube broadcast and updates the internal
     * state to display the associated stream key as being entered.
     *
     * @param {string} boundStreamID - The bound stream ID associated with the
     * broadcast from which to get the stream key.
     * @private
     * @returns {Promise}
     */
    _onYouTubeBroadcastIDSelected(boundStreamID: string): void;
    /**
     * Only show an error if an external request was made with the Google api.
     * Do not error if the login in canceled.
     * And searches in a Google API error response for the error type.
     *
     * @param {Object} response - The Google API response that may contain an
     * error.
     * @private
     * @returns {string|null}
     */
    _parseErrorFromResponse(response: any): void;
    /**
     * Renders a React Element for authenticating with the Google web client.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderYouTubePanel(): JSX.Element;
    /**
     * Returns the error message to display for the current error state.
     *
     * @private
     * @returns {string} The error message to display.
     */
    _getGoogleErrorMessageToDisplay(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StartLiveStreamDialog> & IProps, "dispatch" | "_conference" | "_googleAPIState" | "_googleProfileEmail" | "_streamKey" | "_googleApiApplicationClientID">, keyof import("react-i18next").WithTranslation>>;
export default _default;
