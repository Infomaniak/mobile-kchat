import React, { PureComponent } from 'react';
import { IReduxState } from '../../../app/types';
export interface IProps {
    /**
     * The URL patterns for URLs that needs to be handled with CORS.
     */
    _corsAvatarURLs?: Array<string>;
    /**
     * Custom avatar backgrounds from branding.
     */
    _customAvatarBackgrounds?: Array<string>;
    /**
     * The string we base the initials on (this is generated from a list of precedences).
     */
    _initialsBase?: string;
    /**
     * An URL that we validated that it can be loaded.
     */
    _loadableAvatarUrl?: string;
    /**
     * Indicates whether _loadableAvatarUrl should use CORS or not.
     */
    _loadableAvatarUrlUseCORS?: boolean;
    /**
     * A prop to maintain compatibility with web.
     */
    className?: string;
    /**
     * A string to override the initials to generate a color of. This is handy if you don't want to make
     * the background color match the string that the initials are generated from.
     */
    colorBase?: string;
    /**
     * Display name of the entity to render an avatar for (if any). This is handy when we need
     * an avatar for a non-participant entity (e.g. A recent list item).
     */
    displayName?: string;
    /**
     * Whether or not to update the background color of the avatar.
     */
    dynamicColor?: boolean;
    /**
     * ID of the element, if any.
     */
    id?: string;
    /**
     * The ID of the participant to render an avatar for (if it's a participant avatar).
     */
    participantId?: string;
    /**
     * The size of the avatar.
     */
    size?: number;
    /**
     * One of the expected status strings (e.g. 'available') to render a badge on the avatar, if necessary.
     */
    status?: string;
    /**
     * TestId of the element, if any.
     */
    testId?: string;
    /**
     * URL of the avatar, if any.
     */
    url?: string;
    /**
     * Indicates whether to load the avatar using CORS or not.
     */
    useCORS?: boolean;
}
export interface IState {
    avatarFailed: boolean;
    isUsingCORS: boolean;
}
export declare const DEFAULT_SIZE = 65;
/**
 * Implements a class to render avatars in the app.
 */
declare class Avatar<P extends IProps> extends PureComponent<P, IState> {
    /**
     * Default values for {@code Avatar} component's properties.
     *
     * @static
     */
    static defaultProps: {
        dynamicColor: boolean;
    };
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: P): void;
    /**
     * Implements {@code Componenr#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to handle the error while loading of the avatar URI.
     *
     * @param {Object} params - An object with parameters.
     * @param {boolean} params.dontRetry - If false we will retry to load the Avatar with different CORS mode.
     * @returns {void}
     */
    _onAvatarLoadError(params?: {
        dontRetry?: boolean;
    }): void;
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: IProps): {
    _customAvatarBackgrounds: string[];
    _corsAvatarURLs: string[] | undefined;
    _initialsBase: string | undefined;
    _loadableAvatarUrl: string | undefined;
    _loadableAvatarUrlUseCORS: boolean | undefined;
    colorBase: string | undefined;
};
declare const _default: import("react-redux").ConnectedComponent<typeof Avatar, import("react-redux").Omit<Pick<React.ClassAttributes<Avatar<IProps>> & IProps, "url" | "displayName" | "id" | "status" | "className" | "size" | "testId" | "participantId" | "useCORS" | "_corsAvatarURLs" | "_customAvatarBackgrounds" | "_initialsBase" | "_loadableAvatarUrl" | "_loadableAvatarUrlUseCORS" | "colorBase" | keyof React.ClassAttributes<Avatar<IProps>>> & Partial<Pick<React.ClassAttributes<Avatar<IProps>> & IProps, "dynamicColor">> & Partial<Pick<{
    dynamicColor: boolean;
}, never>>, "_corsAvatarURLs" | "_customAvatarBackgrounds" | "_initialsBase" | "_loadableAvatarUrl" | "_loadableAvatarUrlUseCORS" | "colorBase"> & IProps>;
export default _default;
