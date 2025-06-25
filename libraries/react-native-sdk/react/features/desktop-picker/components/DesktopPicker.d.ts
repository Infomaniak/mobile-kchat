import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of {@link DesktopPicker}.
 */
export interface IProps extends WithTranslation {
    /**
     * An array with desktop sharing sources to be displayed.
     */
    desktopSharingSources: Array<string>;
    /**
     * Used to request DesktopCapturerSources.
     */
    dispatch: IStore['dispatch'];
    /**
     * The callback to be invoked when the component is closed or when a
     * DesktopCapturerSource has been chosen.
     */
    onSourceChoose: Function;
}
/**
 * The type of the React {@code Component} state of {@link DesktopPicker}.
 */
export interface IState {
    /**
     * The state of the audio screen share checkbox.
     */
    screenShareAudio: boolean;
    /**
     * The currently highlighted DesktopCapturerSource.
     */
    selectedSource: any;
    /**
     * The desktop source type currently being displayed.
     */
    selectedTab: string;
    /**
     * An object containing all the DesktopCapturerSources.
     */
    sources: any;
    /**
     * The desktop source types to fetch previews for.
     */
    types: Array<string>;
}
/**
 * React component for DesktopPicker.
 *
 * @augments Component
 */
declare class DesktopPicker extends PureComponent<IProps, IState> {
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: IProps): {
        types: string[];
    };
    /**
     * Extracts only the valid types from the passed {@code types}.
     *
     * @param {Array<string>} types - The types to filter.
     * @private
     * @returns {Array<string>} The filtered types.
     */
    static _getValidTypes(types?: string[]): string[];
    _poller: any;
    state: IState;
    /**
     * Initializes a new DesktopPicker instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Starts polling.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Clean up component and DesktopCapturerSource store state.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Computes the selected source.
     *
     * @param {Object} sources - The available sources.
     * @param {string} selectedTab - The selected tab.
     * @returns {Object} The selectedSource value.
     */
    _getSelectedSource(sources?: any, selectedTab?: string): any;
    /**
     * Dispatches an action to hide the DesktopPicker and invokes the passed in
     * callback with a selectedSource, if any.
     *
     * @param {string} [id] - The id of the DesktopCapturerSource to pass into
     * the onSourceChoose callback.
     * @param {string} type - The type of the DesktopCapturerSource to pass into
     * the onSourceChoose callback.
     * @param {boolean} screenShareAudio - Whether or not to add system audio to
     * screen sharing session.
     * @returns {void}
     */
    _onCloseModal(id?: string, type?: string, screenShareAudio?: boolean): void;
    /**
     * Sets the currently selected DesktopCapturerSource.
     *
     * @param {string} id - The id of DesktopCapturerSource.
     * @param {string} type - The type of DesktopCapturerSource.
     * @returns {void}
     */
    _onPreviewClick(id: string, type: string): void;
    /**
     * Request to close the modal and execute callbacks with the selected source
     * id.
     *
     * @returns {void}
     */
    _onSubmit(): void;
    /**
     * Stores the selected tab and updates the selected source via
     * {@code _getSelectedSource}.
     *
     * @param {string} id - The id of the newly selected tab.
     * @returns {void}
     */
    _onTabSelected(id: string): void;
    /**
     * Set the screenSharingAudio state indicating whether or not to also share
     * system audio.
     *
     * @param {boolean} checked - Share audio or not.
     * @returns {void}
     */
    _onShareAudioChecked(checked: boolean): void;
    /**
     * Configures and renders the tabs for display.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderTabs(): JSX.Element;
    /**
     * Create an interval to update known available DesktopCapturerSources.
     *
     * @private
     * @returns {void}
     */
    _startPolling(): void;
    /**
     * Cancels the interval to update DesktopCapturerSources.
     *
     * @private
     * @returns {void}
     */
    _stopPolling(): void;
    /**
     * Obtains the desktop sources and updates state with them.
     *
     * @private
     * @returns {void}
     */
    _updateSources(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<DesktopPicker> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
