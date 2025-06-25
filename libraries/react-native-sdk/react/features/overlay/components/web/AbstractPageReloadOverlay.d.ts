import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractPageReloadOverlay}.
 */
export interface IProps extends WithTranslation {
    /**
     * The details is an object containing more information about the connection
     * failed (shard changes, was the computer suspended, etc.).
     */
    details?: Object;
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The error that caused the display of the overlay.
     */
    error?: any;
    /**
     * The indicator which determines whether the reload was caused by network
     * failure.
     */
    isNetworkFailure: boolean;
    /**
     * The reason for the error that will cause the reload.
     * NOTE: Used by PageReloadOverlay only.
     */
    reason?: string;
}
/**
 * The type of the React {@code Component} state of
 * {@link AbstractPageReloadOverlay}.
 */
export interface IState {
    /**
     * The translation key for the title of the overlay.
     */
    message: string;
    /**
     * Current value(time) of the timer.
     */
    timeLeft: number;
    /**
     * How long the overlay dialog will be displayed before the conference will
     * be reloaded.
     */
    timeoutSeconds: number;
    /**
     * The translation key for the title of the overlay.
     */
    title: string;
}
/**
 * Implements an abstract React {@link Component} for the page reload overlays.
 *
 * FIXME: This is not really an abstract class as some components and functions are very web specific.
 */
export default class AbstractPageReloadOverlay<P extends IProps> extends Component<P, IState> {
    /**
     * Determines whether this overlay needs to be rendered (according to a
     * specific redux state). Called by {@link OverlayContainer}.
     *
     * @param {Object} state - The redux state.
     * @returns {boolean} - If this overlay needs to be rendered, {@code true};
     * {@code false}, otherwise.
     */
    static needsRender(state: IReduxState): true | Error | undefined;
    _interval: number | undefined;
    /**
     * Initializes a new AbstractPageReloadOverlay instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     * @public
     */
    constructor(props: P);
    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Clears the timer interval.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Renders the button for reloading the page if necessary.
     *
     * @protected
     * @returns {ReactElement|null}
     */
    _renderButton(): JSX.Element | null;
    /**
     * Renders the progress bar.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderProgressBar(): JSX.Element;
}
/**
 * Maps (parts of) the redux state to the associated component's props.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {{
 *     details: Object,
 *     error: ?Error,
 *     isNetworkFailure: boolean,
 *     reason: string
 * }}
 */
export declare function abstractMapStateToProps(state: IReduxState): {
    details: Object | undefined;
    error: {
        details: Object;
        message?: string | undefined;
        name?: string | undefined;
    } | undefined;
    isNetworkFailure: boolean;
    reason: string | undefined;
};
