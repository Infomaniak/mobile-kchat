import React from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { IProps as AbstractProps, AbstractWelcomePage } from './AbstractWelcomePage';
export interface IProps extends AbstractProps {
    /**
     * Function for getting the unsafe room text.
     */
    getUnsafeRoomTextFn: Function;
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: any;
}
/**
 * The native container rendering the welcome page.
 *
 * @augments AbstractWelcomePage
 */
declare class WelcomePage extends AbstractWelcomePage<IProps> {
    _onFieldBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    _onFieldFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    /**
     * Constructor of the Component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInsecureRoomNameWarning(): JSX.Element;
    /**
     * Constructs a style array to handle the hint box animation.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getHintBoxStyle(): ({
        flexDirection: string;
        overflow: string;
    } | {
        backgroundColor: any;
        borderRadius: any;
        marginVertical: any;
        paddingHorizontal: any;
        paddingVertical: number;
    } | {
        opacity: any;
    })[];
    /**
     * Callback for when the room field's focus changes so the hint box
     * must be rendered or removed.
     *
     * @private
     * @param {boolean} focused - The focused state of the field.
     * @returns {void}
     */
    _onFieldFocusChange(focused: boolean): void;
    /**
     * Callback for when the settings screen is focused.
     *
     * @private
     * @param {boolean} focused - The focused state of the screen.
     * @returns {void}
     */
    _onSettingsScreenFocused(focused: boolean): void;
    /**
     * Renders the hint box if necessary.
     *
     * @private
     * @returns {React$Node}
     */
    _renderHintBox(): JSX.Element | null;
    /**
     * Renders the join button.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderJoinButton(): JSX.Element;
    /**
     * Renders the room name input.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderRoomNameInput(): JSX.Element;
    /**
     * Renders the full welcome page.
     *
     * @returns {ReactElement}
     */
    _renderFullUI(): JSX.Element;
    /**
     * Renders a "reduced" version of the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderReducedUI(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<WelcomePage> & IProps, "dispatch" | "_calendarEnabled" | "_deeplinkingCfg" | "_enableInsecureRoomNameWarning" | "_moderatedRoomServiceUrl" | "_recentListEnabled" | "_room" | "_settings" | "getUnsafeRoomTextFn">, keyof import("react-i18next").WithTranslation>>;
export default _default;
