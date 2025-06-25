import BaseApp from '../../base/app/components/BaseApp';
/**
 * The type of React {@code Component} props of {@link AbstractApp}.
 */
export interface IProps {
    /**
     * XXX Refer to the implementation of loadURLObject: in
     * ios/sdk/src/JitsiMeetView.m for further information.
     */
    timestamp?: number;
    /**
     * The URL, if any, with which the app was launched.
     */
    url?: Object | string;
}
/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export declare class AbstractApp<P extends IProps = IProps> extends BaseApp<P> {
    /**
     * The deferred for the initialisation {{promise, resolve, reject}}.
     */
    _init: {
        promise: Promise<any>;
    };
    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    componentDidMount(): Promise<void>;
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): Promise<void>;
    /**
     * Gets the default URL to be opened when this {@code App} mounts.
     *
     * @protected
     * @returns {string} The default URL to be opened when this {@code App}
     * mounts.
     */
    _getDefaultURL(): string;
    /**
     * Navigates this {@code AbstractApp} to (i.e. Opens) a specific URL.
     *
     * @param {Object|string} url - The URL to navigate this {@code AbstractApp}
     * to (i.e. The URL to open).
     * @protected
     * @returns {void}
     */
    _openURL(url: string | Object): void;
}
