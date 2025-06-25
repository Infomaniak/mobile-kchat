/// <reference types="react" />
import { ILocalParticipant } from '../../../base/participants/types';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ProfileButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Default displayed name for local participant.
     */
    _defaultLocalDisplayName: string;
    /**
     * The redux representation of the local participant.
     */
    _localParticipant?: ILocalParticipant;
    /**
      * Whether the button support clicking or not.
      */
    _unclickable: boolean;
}
/**
 * Implementation of a button for opening profile dialog.
 */
declare class ProfileButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: import("react-redux").ConnectedComponent<{
        new (props: import("./ProfileButtonAvatar").IProps | Readonly<import("./ProfileButtonAvatar").IProps>): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./ProfileButtonAvatar").IProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<import("./ProfileButtonAvatar").IProps> & Readonly<{
                children?: import("react").ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: import("react").ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<import("./ProfileButtonAvatar").IProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<import("./ProfileButtonAvatar").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new (props: import("./ProfileButtonAvatar").IProps, context: any): {
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./ProfileButtonAvatar").IProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<import("./ProfileButtonAvatar").IProps> & Readonly<{
                children?: import("react").ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: import("react").ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<import("./ProfileButtonAvatar").IProps>, prevState: Readonly<{}>): any;
            componentDidUpdate?(prevProps: Readonly<import("./ProfileButtonAvatar").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): void;
        };
        contextType?: import("react").Context<any> | undefined;
    }, import("react-redux").Omit<import("react").ClassAttributes<{
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("./ProfileButtonAvatar").IProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<import("./ProfileButtonAvatar").IProps> & Readonly<{
            children?: import("react").ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<import("./ProfileButtonAvatar").IProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<import("./ProfileButtonAvatar").IProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("./ProfileButtonAvatar").IProps>, nextState: Readonly<{}>, nextContext: any): void;
    }> & import("./ProfileButtonAvatar").IProps, "_localParticipant">>;
    /**
     * Retrieves the label.
     *
     * @returns {string}
     */
    _getLabel(): string;
    /**
     * Retrieves the tooltip.
     *
     * @returns {string}
     */
    _getTooltip(): string;
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Indicates whether the button should be disabled or not.
     *
     * @protected
     * @returns {void}
     */
    _isDisabled(): boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ProfileButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_localParticipant" | "_defaultLocalDisplayName" | "_unclickable" | keyof import("react").ClassAttributes<ProfileButton>> & Partial<Pick<import("react").ClassAttributes<ProfileButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
    afterClick: undefined;
    disabledStyles: {
        iconStyle: {
            opacity: number;
        };
        labelStyle: {
            opacity: number;
        };
        style: undefined;
        underlayColor: undefined;
    };
    showLabel: boolean;
    styles: undefined;
    toggledStyles: undefined;
    tooltipPosition: string;
    visible: boolean;
}, never>>, "dispatch" | "customClass" | "_localParticipant" | "_defaultLocalDisplayName" | "_unclickable">, keyof import("react-i18next").WithTranslation>>;
export default _default;
