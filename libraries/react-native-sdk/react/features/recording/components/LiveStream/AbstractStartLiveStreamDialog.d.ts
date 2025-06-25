import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractStartLiveStreamDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * The {@code JitsiConference} for the current conference.
     */
    _conference?: IJitsiConference;
    /**
     * The current state of interactions with the Google API. Determines what
     * Google related UI should display.
     */
    _googleAPIState: number;
    /**
     * The email of the user currently logged in to the Google web client
     * application.
     */
    _googleProfileEmail: string;
    /**
     * The live stream key that was used before.
     */
    _streamKey?: string;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    navigation?: any;
}
/**
 * The type of the React {@code Component} state of
 * {@link AbstractStartLiveStreamDialog}.
 */
export interface IState {
    /**
     * Details about the broadcasts available for use for the logged in Google
     * user's YouTube account.
     */
    broadcasts?: Array<any>;
    /**
     * The error type, as provided by Google, for the most recent error
     * encountered by the Google API.
     */
    errorType?: string;
    /**
     * The boundStreamID of the broadcast currently selected in the broadcast
     * dropdown.
     */
    selectedBoundStreamID?: string;
    /**
     * The selected or entered stream key to use for YouTube live streaming.
     */
    streamKey?: string;
}
/**
 * Implements an abstract class for the StartLiveStreamDialog on both platforms.
 *
 * NOTE: Google log-in is not supported for mobile yet for later implementation
 * but the abstraction of its properties are already present in this abstract
 * class.
 */
export default class AbstractStartLiveStreamDialog<P extends IProps> extends Component<P, IState> {
    _isMounted: boolean;
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#componentWillUnmount()}. Invoked
     * immediately before this component is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Invokes the passed in {@link onCancel} callback and closes
     * {@code StartLiveStreamDialog}.
     *
     * @private
     * @returns {boolean} True is returned to close the modal.
     */
    _onCancel(): boolean;
    /**
     * Asks the user to sign in, if not already signed in, and then requests a
     * list of the user's YouTube broadcasts.
     *
     * NOTE: To be implemented by platforms.
     *
     * @private
     * @returns {Promise}
     */
    _onGetYouTubeBroadcasts(): Promise<any> | void;
    /**
     * Callback invoked to update the {@code StartLiveStreamDialog} component's
     * display of the entered YouTube stream key.
     *
     * @param {string} streamKey - The stream key entered in the field.
     * @private
     * @returns {void}
     */
    _onStreamKeyChange(streamKey: string): void;
    /**
     * Invokes the passed in {@link onSubmit} callback with the entered stream
     * key, and then closes {@code StartLiveStreamDialog}.
     *
     * @private
     * @returns {boolean} False if no stream key is entered to preventing
     * closing, true to close the modal.
     */
    _onSubmit(): boolean;
    /**
     * Updates the internal state if the component is still mounted. This is a
     * workaround for all the state setting that occurs after ajax.
     *
     * @param {Object} newState - The new state to merge into the existing
     * state.
     * @private
     * @returns {void}
     */
    _setStateIfMounted(newState: IState): void;
}
/**
 * Maps part of the Redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _conference: Object,
 *     _googleAPIState: number,
 *     _googleProfileEmail: string,
 *     _streamKey: string
 * }}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _conference: IJitsiConference | undefined;
    _googleAPIState: number;
    _googleProfileEmail: string;
    _streamKey: string | undefined;
};
