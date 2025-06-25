import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../app/types';
import { IDeeplinkingConfig } from '../../base/config/configType';
/**
 * {@code AbstractWelcomePage}'s React {@code Component} prop types.
 */
export interface IProps extends WithTranslation {
    /**
     * Whether the calendar functionality is enabled or not.
     */
    _calendarEnabled: boolean;
    /**
     * The deeplinking config.
     */
    _deeplinkingCfg: IDeeplinkingConfig;
    /**
     * Whether the insecure room name functionality is enabled or not.
     */
    _enableInsecureRoomNameWarning: boolean;
    /**
     * URL for the moderated rooms microservice, if available.
     */
    _moderatedRoomServiceUrl?: string;
    /**
     * Whether the recent list is enabled.
     */
    _recentListEnabled: Boolean;
    /**
     * Room name to join to.
     */
    _room: string;
    /**
     * The current settings.
     */
    _settings: Object;
    /**
     * The Redux dispatch Function.
     */
    dispatch: IStore['dispatch'];
}
export interface IState {
    _fieldFocused?: boolean;
    animateTimeoutId?: number;
    generateRoomNames?: string;
    generatedRoomName: string;
    hintBoxAnimation?: any;
    insecureRoomName: boolean;
    isSettingsScreenFocused?: boolean;
    joining: boolean;
    room: string;
    roomNameInputAnimation?: any;
    roomPlaceholder: string;
    updateTimeoutId?: number;
}
/**
 * Base (abstract) class for container component rendering the welcome page.
 *
 * @abstract
 */
export declare class AbstractWelcomePage<P extends IProps> extends Component<P, IState> {
    _mounted: boolean | undefined;
    /**
     * Save room name into component's local state.
     *
     * @type {Object}
     * @property {number|null} animateTimeoutId - Identifier of the letter
     * animation timeout.
     * @property {string} generatedRoomName - Automatically generated room name.
     * @property {string} room - Room name.
     * @property {string} roomPlaceholder - Room placeholder that's used as a
     * placeholder for input.
     * @property {number|null} updateTimeoutId - Identifier of the timeout
     * updating the generated room name.
     */
    state: IState;
    /**
     * Initializes a new {@code AbstractWelcomePage} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code AbstractWelcomePage} instance with.
     */
    constructor(props: P);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
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
     * Animates the changing of the room name.
     *
     * @param {string} word - The part of room name that should be added to
     * placeholder.
     * @private
     * @returns {void}
     */
    _animateRoomNameChanging(word: string): void;
    /**
     * Method that clears timeouts for animations and updates of room name.
     *
     * @private
     * @returns {void}
     */
    _clearTimeouts(): void;
    /**
     * Renders the insecure room name warning.
     *
     * @returns {ReactElement}
     */
    _doRenderInsecureRoomNameWarning(): JSX.Element | null;
    /**
     * Handles joining. Either by clicking on 'Join' button
     * or by pressing 'Enter' in room name input field.
     *
     * @protected
     * @returns {void}
     */
    _onJoin(): void;
    /**
     * Handles 'change' event for the room name text input field.
     *
     * @param {string} value - The text typed into the respective text input
     * field.
     * @protected
     * @returns {void}
     */
    _onRoomChange(value: string): void;
    /**
     * Renders the insecure room name warning if needed.
     *
     * @returns {ReactElement}
     */
    _renderInsecureRoomNameWarning(): JSX.Element | null;
    /**
     * Triggers the generation of a new room name and initiates an animation of
     * its changing.
     *
     * @protected
     * @returns {void}
     */
    _updateRoomName(): void;
}
/**
 * Maps (parts of) the redux state to the React {@code Component} props of
 * {@code AbstractWelcomePage}.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _calendarEnabled: boolean;
    _deeplinkingCfg: IDeeplinkingConfig;
    _enableInsecureRoomNameWarning: boolean;
    _moderatedRoomServiceUrl: string | undefined;
    _recentListEnabled: any;
    _room: string;
    _settings: import("../../base/settings/reducer").ISettingsState;
};
