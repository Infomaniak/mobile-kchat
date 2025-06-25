/// <reference types="react" />
import { IReduxState } from '../app/types';
/**
 * Generates a deep linking URL based on the current window URL.
 *
 * @param {Object} state - Object containing current redux state.
 *
 * @returns {string} - The generated URL.
 */
export declare function generateDeepLinkingURL(state: IReduxState): string;
/**
 * Resolves with the component that should be displayed if the deep linking page
 * should be shown and with <tt>undefined</tt> otherwise.
 *
 * @param {Object} state - Object containing current redux state.
 * @returns {Promise<Component>}
 */
export declare function getDeepLinkingPage(state: IReduxState): Promise<void> | Promise<import("react").ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>> | import("react-redux").ConnectedComponent<{
    new (props: import("./components/NoMobileApp").IProps | Readonly<import("./components/NoMobileApp").IProps>): {
        componentDidMount(): void;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./components/NoMobileApp").IProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<import("./components/NoMobileApp").IProps> & Readonly<{
            children?: import("react").ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<import("./components/NoMobileApp").IProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<import("./components/NoMobileApp").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: import("./components/NoMobileApp").IProps, context: any): {
        componentDidMount(): void;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./components/NoMobileApp").IProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<import("./components/NoMobileApp").IProps> & Readonly<{
            children?: import("react").ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<import("./components/NoMobileApp").IProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<import("./components/NoMobileApp").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: import("react").Context<any> | undefined;
}, import("react-redux").Omit<import("react").ClassAttributes<{
    componentDidMount(): void;
    render(): JSX.Element;
    context: any;
    setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./components/NoMobileApp").IProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
    forceUpdate(callback?: (() => void) | undefined): void;
    readonly props: Readonly<import("./components/NoMobileApp").IProps> & Readonly<{
        children?: import("react").ReactNode;
    }>;
    state: Readonly<{}>;
    refs: {
        [key: string]: import("react").ReactInstance;
    };
    shouldComponentUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<import("./components/NoMobileApp").IProps>, prevState: Readonly<{}>): any;
    componentDidUpdate?(prevProps: Readonly<import("./components/NoMobileApp").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./components/NoMobileApp").IProps>, nextState: Readonly<{}>, nextContext: any): void;
}> & import("./components/NoMobileApp").IProps, "_deeplinkingCfg">>> | Promise<import("react").ComponentClass<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>, any> | import("react").FunctionComponent<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>> | undefined>;
/**
 * Opens the desktop app.
 *
 * @param {Object} state - Object containing current redux state.
 * @returns {Promise<boolean>} - Resolves with true if the attempt to open the desktop app was successful and resolves
 * with false otherwise.
 */
export declare function openDesktopApp(state: IReduxState): Promise<boolean>;
