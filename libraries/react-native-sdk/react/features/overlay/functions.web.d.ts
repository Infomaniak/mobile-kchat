/// <reference types="react" />
import { IReduxState } from '../app/types';
/**
 * Returns the overlay to be currently rendered.
 *
 * @param {IReduxState} state - The Redux state.
 * @returns {?React$ComponentType<*>}
 */
export declare function getOverlayToRender(state: IReduxState): import("react").ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>> | import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<import("react").ClassAttributes<{
    render(): JSX.Element;
    _interval: number | undefined;
    componentDidMount(): void;
    componentWillUnmount(): void;
    _renderButton(): JSX.Element | null;
    _renderProgressBar(): JSX.Element;
    context: any;
    setState<K extends keyof import("./components/web/AbstractPageReloadOverlay").IState>(state: import("./components/web/AbstractPageReloadOverlay").IState | ((prevState: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>, props: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>) => import("./components/web/AbstractPageReloadOverlay").IState | Pick<import("./components/web/AbstractPageReloadOverlay").IState, K> | null) | Pick<import("./components/web/AbstractPageReloadOverlay").IState, K> | null, callback?: (() => void) | undefined): void;
    forceUpdate(callback?: (() => void) | undefined): void;
    readonly props: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps> & Readonly<{
        children?: import("react").ReactNode;
    }>;
    state: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>;
    refs: {
        [key: string]: import("react").ReactInstance;
    };
    shouldComponentUpdate?(nextProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, nextState: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>, nextContext: any): boolean;
    componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, prevState: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>): any;
    componentDidUpdate?(prevProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, prevState: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>, snapshot?: any): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, nextState: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./components/web/AbstractPageReloadOverlay").IProps>, nextState: Readonly<import("./components/web/AbstractPageReloadOverlay").IState>, nextContext: any): void;
}> & import("./components/web/AbstractPageReloadOverlay").IProps, "details" | "error" | "dispatch" | "isNetworkFailure" | "reason">, keyof import("react-i18next").WithTranslation>> | import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<import("react").ClassAttributes<{
    render(): JSX.Element;
    _renderPolicyLogo(): JSX.Element | null;
    context: any;
    setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>) => {} | Pick<{}, K_1> | null) | Pick<{}, K_1> | null, callback?: (() => void) | undefined): void;
    forceUpdate(callback?: (() => void) | undefined): void;
    readonly props: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps> & Readonly<{
        children?: import("react").ReactNode;
    }>;
    state: Readonly<{}>;
    refs: {
        [key: string]: import("react").ReactInstance;
    };
    componentDidMount?(): void;
    shouldComponentUpdate?(nextProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, prevState: Readonly<{}>): any;
    componentDidUpdate?(prevProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, nextState: Readonly<{}>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./components/web/AbstractUserMediaPermissionsOverlay").IProps>, nextState: Readonly<{}>, nextContext: any): void;
}> & import("./components/web/AbstractUserMediaPermissionsOverlay").IProps, "browser" | "_premeetingBackground">, keyof import("react-i18next").WithTranslation>> | undefined;
