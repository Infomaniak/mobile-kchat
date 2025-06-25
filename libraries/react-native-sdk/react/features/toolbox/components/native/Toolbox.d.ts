/// <reference types="react" />
/**
 * The type of {@link Toolbox}'s React {@code Component} props.
 */
export interface IProps {
    /**
     * Whether the end conference feature is supported.
     */
    _endConferenceSupported: boolean;
    /**
     * Whether we are in visitors mode.
     */
    _iAmVisitor: boolean;
    /**
     * Whether or not any reactions buttons should be visible.
     */
    _shouldDisplayReactionsButtons: boolean;
    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: any;
    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean;
    /**
     * The width of the screen.
     */
    _width: number;
}
/**
 * Implements the conference Toolbox on React Native.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
declare function Toolbox(props: IProps): JSX.Element | null;
declare const _default: import("react-redux").ConnectedComponent<typeof Toolbox, import("react-redux").Omit<IProps, "_width" | "_visible" | "_styles" | "_shouldDisplayReactionsButtons" | "_endConferenceSupported" | "_iAmVisitor">>;
export default _default;
