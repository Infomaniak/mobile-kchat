import React, { Component, ComponentType } from 'react';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} state of {@link BaseApp}.
 */
export interface IState {
    /**
     * The {@code Route} rendered by the {@code BaseApp}.
     */
    route: {
        component?: ComponentType;
        props?: Object;
    };
    /**
     * The redux store used by the {@code BaseApp}.
     */
    store?: IStore;
}
/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export default class BaseApp<P> extends Component<P, IState> {
    /**
     * The deferred for the initialisation {{promise, resolve, reject}}.
     */
    _init: {
        promise: Promise<any>;
    };
    /**
     * Initializes a new {@code BaseApp} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: P);
    /**
     * Initializes the app.
     *
     * @inheritdoc
    */
    componentDidMount(): Promise<void>;
    /**
     * De-initializes the app.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Logs for errors that were not caught.
     *
     * @param {Error} error - The error that was thrown.
     * @param {Object} info - Info about the error(stack trace);.
     *
     * @returns {void}
     */
    componentDidCatch(error: Error, info: Object): void;
    /**
     * Delays this {@code BaseApp}'s startup until the {@code Storage}
     * implementation of {@code localStorage} initializes. While the
     * initialization is instantaneous on Web (with Web Storage API), it is
     * asynchronous on mobile/react-native.
     *
     * @private
     * @returns {Promise}
     */
    _initStorage(): Promise<any>;
    /**
     * Extra initialisation that subclasses might require.
     *
     * @returns {void}
     */
    _extraInit(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionally)
     * alongside the main element.
     *
     * @returns {ReactElement}
     * @abstract
     * @protected
     */
    _createExtraElement(): React.ReactElement | null;
    /**
     * Creates a {@link ReactElement} from the specified component, the
     * specified props and the props of this {@code AbstractApp} which are
     * suitable for propagation to the children of this {@code Component}.
     *
     * @param {Component} component - The component from which the
     * {@code ReactElement} is to be created.
     * @param {Object} props - The read-only React {@code Component} props with
     * which the {@code ReactElement} is to be initialized.
     * @returns {ReactElement}
     * @protected
     */
    _createMainElement(component?: ComponentType, props?: Object): React.ReactElement<{}, string | React.JSXElementConstructor<any>> | null;
    /**
     * Initializes a new redux store instance suitable for use by this
     * {@code AbstractApp}.
     *
     * @private
     * @returns {Store} - A new redux store instance suitable for use by
     * this {@code AbstractApp}.
     */
    _createStore(): import("redux").Store<{
        [x: string]: any;
    }, import("redux").AnyAction>;
    /**
     * Navigates to a specific Route.
     *
     * @param {Route} route - The Route to which to navigate.
     * @returns {Promise}
     */
    _navigate(route: {
        component?: ComponentType<any>;
        href?: string;
        props?: Object;
    }): Promise<any>;
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer(): React.ReactElement | null;
}
