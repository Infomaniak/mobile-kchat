import React from 'react';
import { AbstractWelcomePage, IProps } from './AbstractWelcomePage';
/**
 * The pattern used to validate room name.
 *
 * @type {string}
 */
export declare const ROOM_NAME_VALIDATE_PATTERN_STR = "^[^?&:\"'%#]+$";
/**
 * The Web container rendering the welcome page.
 *
 * @augments AbstractWelcomePage
 */
declare class WelcomePage extends AbstractWelcomePage<IProps> {
    _additionalContentRef: HTMLDivElement | null;
    _additionalToolbarContentRef: HTMLDivElement | null;
    _additionalCardRef: HTMLDivElement | null;
    _roomInputRef: HTMLInputElement | null;
    _additionalCardTemplate: HTMLTemplateElement | null;
    _additionalContentTemplate: HTMLTemplateElement | null;
    _additionalToolbarContentTemplate: HTMLTemplateElement | null;
    _titleHasNotAllowCharacter: boolean;
    /**
     * Default values for {@code WelcomePage} component's properties.
     *
     * @static
     */
    static defaultProps: {
        _room: string;
    };
    /**
     * Initializes a new WelcomePage instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Removes the classname used for custom styling of the welcome page.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render(): JSX.Element;
    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInsecureRoomNameWarning(): JSX.Element;
    /**
     * Prevents submission of the form and delegates join logic.
     *
     * @param {Event} event - The HTML Event which details the form submission.
     * @private
     * @returns {void}
     */
    _onFormSubmit(event: React.FormEvent): void;
    /**
     * Overrides the super to account for the differences in the argument types
     * provided by HTML and React Native text inputs.
     *
     * @inheritdoc
     * @override
     * @param {Event} event - The (HTML) Event which details the change such as
     * the EventTarget.
     * @protected
     */
    _onRoomChange(event: React.ChangeEvent<HTMLInputElement>): void;
    /**
     * Renders the footer.
     *
     * @returns {ReactElement}
     */
    _renderFooter(): JSX.Element;
    /**
     * Renders tabs to show previous meetings and upcoming calendar events. The
     * tabs are purposefully hidden on mobile browsers.
     *
     * @returns {ReactElement|null}
     */
    _renderTabs(): JSX.Element | null;
    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * additional card shown near the tabs card.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the welcome page content.
     * @private
     * @returns {void}
     */
    _setAdditionalCardRef(el: HTMLDivElement): void;
    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * welcome page content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the welcome page content.
     * @private
     * @returns {void}
     */
    _setAdditionalContentRef(el: HTMLDivElement): void;
    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * toolbar additional content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the additional toolbar content.
     * @private
     * @returns {void}
     */
    _setAdditionalToolbarContentRef(el: HTMLDivElement): void;
    /**
     * Sets the internal reference to the HTMLInputElement used to hold the
     * welcome page input room element.
     *
     * @param {HTMLInputElement} el - The HTMLElement for the input of the room name on the welcome page.
     * @private
     * @returns {void}
     */
    _setRoomInputRef(el: HTMLInputElement): void;
    /**
     * Returns whether or not an additional card should be displayed near the tabs.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalCard(): any;
    /**
     * Returns whether or not additional content should be displayed below
     * the welcome page's header for entering a room name.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalContent(): any;
    /**
     * Returns whether or not additional content should be displayed inside
     * the header toolbar.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalToolbarContent(): any;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<WelcomePage> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "_deeplinkingCfg" | "_calendarEnabled" | "_enableInsecureRoomNameWarning" | "_moderatedRoomServiceUrl" | "_recentListEnabled" | "_settings" | keyof React.ClassAttributes<WelcomePage>> & Partial<Pick<React.ClassAttributes<WelcomePage> & IProps, "_room">> & Partial<Pick<{
    _room: string;
}, never>>, "dispatch" | "_room" | "_deeplinkingCfg" | "_calendarEnabled" | "_enableInsecureRoomNameWarning" | "_moderatedRoomServiceUrl" | "_recentListEnabled" | "_settings">, keyof import("react-i18next").WithTranslation>>;
export default _default;
