import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IJitsiConference } from '../../base/conference/reducer';
/**
 * The type of the React {@code PureComponent} props of {@link ChromeExtensionBanner}.
 */
export interface IProps extends WithTranslation {
    /**
     * Contains info about installed/to be installed chrome extension(s).
     */
    bannerCfg: {
        chromeExtensionsInfo?: string[];
        edgeUrl?: string;
        url?: string;
    };
    /**
     * Conference data, if any.
     */
    conference?: IJitsiConference;
    /**
     * Whether I am the current recorder.
     */
    iAmRecorder: boolean;
    /**
     * Whether it's a vpaas meeting or not.
     */
    isVpaas: boolean;
}
/**
 * The type of the React {@link PureComponent} state of {@link ChromeExtensionBanner}.
 */
export interface IState {
    /**
     * Tells whether user pressed install extension or close button.
     */
    closePressed: boolean;
    /**
     * Keeps the current value of dont show again checkbox.
     */
    dontShowAgainChecked: boolean;
    /**
     * Tells whether should show the banner or not based on extension being installed or not.
     */
    shouldShow: boolean;
}
/**
 * Implements a React {@link PureComponent} which displays a banner having a link to the chrome extension.
 *
 * @class ChromeExtensionBanner
 * @augments PureComponent
 */
declare class ChromeExtensionBanner extends PureComponent<IProps, IState> {
    isEdge: boolean;
    /**
     * Initializes a new {@code ChromeExtensionBanner} instance.
     *
     * @param {Object} props - The read-only React {@code PureComponent} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Executed on component update.
     * Checks whether any chrome extension from the config is installed.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): Promise<void>;
    /**
     * Checks whether the feature is enabled and whether the environment(browser/os)
     * supports it.
     *
     * @returns {boolean}
     */
    _isSupportedEnvironment(): any;
    /**
     * Closes the banner for the current session.
     *
     * @returns {void}
     */
    _onClosePressed(): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onCloseKeyPress(e: React.KeyboardEvent): void;
    /**
     * Opens the chrome extension page.
     *
     * @returns {void}
     */
    _onInstallExtensionClick(): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onInstallExtensionKeyPress(e: React.KeyboardEvent): void;
    /**
     * Checks whether the banner should not be rendered.
     *
     * @returns {boolean} Whether to show the banner or not.
     */
    _shouldNotRender(): boolean;
    /**
    * Handles the current `don't show again` checkbox state.
    *
    * @param {Object} event - Input change event.
    * @returns {void}
    */
    _onDontShowAgainChange(event: React.ChangeEvent<HTMLInputElement>): void;
    /**
     * Implements React's {@link PureComponent#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): React.ReactNode;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ChromeExtensionBanner> & IProps, "conference" | "iAmRecorder" | "isVpaas" | "bannerCfg">, keyof WithTranslation>>;
export default _default;
