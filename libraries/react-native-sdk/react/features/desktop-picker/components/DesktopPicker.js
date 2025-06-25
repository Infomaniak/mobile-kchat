"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const actions_1 = require("../../base/dialog/actions");
const functions_1 = require("../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../base/ui/components/web/Dialog"));
const Tabs_1 = __importDefault(require("../../base/ui/components/web/Tabs"));
const constants_1 = require("../constants");
const functions_2 = require("../functions");
const logger_1 = __importDefault(require("../logger"));
const DesktopPickerPane_1 = __importDefault(require("./DesktopPickerPane"));
/**
 * The sources polling interval in ms.
 *
 * @type {int}
 */
const UPDATE_INTERVAL = 2000;
/**
 * The default selected tab.
 *
 * @type {string}
 */
const DEFAULT_TAB_TYPE = 'screen';
const TAB_LABELS = {
    screen: 'dialog.yourEntireScreen',
    window: 'dialog.applicationWindow'
};
const VALID_TYPES = Object.keys(TAB_LABELS);
/**
 * React component for DesktopPicker.
 *
 * @augments Component
 */
class DesktopPicker extends react_1.PureComponent {
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props) {
        return {
            types: DesktopPicker._getValidTypes(props.desktopSharingSources)
        };
    }
    /**
     * Extracts only the valid types from the passed {@code types}.
     *
     * @param {Array<string>} types - The types to filter.
     * @private
     * @returns {Array<string>} The filtered types.
     */
    static _getValidTypes(types = []) {
        return types.filter(type => VALID_TYPES.includes(type));
    }
    /**
     * Initializes a new DesktopPicker instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._poller = null;
        this.state = {
            screenShareAudio: false,
            selectedSource: {},
            selectedTab: DEFAULT_TAB_TYPE,
            sources: {},
            types: []
        };
        // Bind event handlers so they are only bound once per instance.
        this._onCloseModal = this._onCloseModal.bind(this);
        this._onPreviewClick = this._onPreviewClick.bind(this);
        this._onShareAudioChecked = this._onShareAudioChecked.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onTabSelected = this._onTabSelected.bind(this);
        this._updateSources = this._updateSources.bind(this);
        this.state.types
            = DesktopPicker._getValidTypes(this.props.desktopSharingSources);
    }
    /**
     * Starts polling.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        this._startPolling();
    }
    /**
     * Clean up component and DesktopCapturerSource store state.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._stopPolling();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { selectedTab, selectedSource, sources, types } = this.state;
        return (react_1.default.createElement(Dialog_1.default, { ok: {
                disabled: Boolean(!this.state.selectedSource.id),
                translationKey: 'dialog.Share'
            }, onCancel: this._onCloseModal, onSubmit: this._onSubmit, size: 'large', titleKey: 'dialog.shareYourScreen' },
            this._renderTabs(),
            types.map(type => (react_1.default.createElement("div", { "aria-labelledby": `${type}-button`, className: selectedTab === type ? undefined : 'hide', id: `${type}-panel`, key: type, role: 'tabpanel', tabIndex: 0 }, selectedTab === type && (react_1.default.createElement(DesktopPickerPane_1.default, { key: selectedTab, onClick: this._onPreviewClick, onDoubleClick: this._onSubmit, onShareAudioChecked: this._onShareAudioChecked, selectedSourceId: selectedSource.id, sources: sources[selectedTab], type: selectedTab })))))));
    }
    /**
     * Computes the selected source.
     *
     * @param {Object} sources - The available sources.
     * @param {string} selectedTab - The selected tab.
     * @returns {Object} The selectedSource value.
     */
    _getSelectedSource(sources = {}, selectedTab) {
        const { selectedSource } = this.state;
        const currentSelectedTab = selectedTab ?? this.state.selectedTab;
        /**
         * If there are no sources for this type (or no sources for any type)
         * we can't select anything.
         */
        if (!Array.isArray(sources[currentSelectedTab])
            || sources[currentSelectedTab].length <= 0) {
            return {};
        }
        /**
         * Select the first available source for this type in the following
         * scenarios:
         * 1) Nothing is yet selected.
         * 2) Tab change.
         * 3) The selected source is no longer available.
         */
        if (!selectedSource // scenario 1)
            || selectedSource.type !== currentSelectedTab // scenario 2)
            || !sources[currentSelectedTab].some(// scenario 3)
            (source) => source.id === selectedSource.id)) {
            return {
                id: sources[currentSelectedTab][0].id,
                type: currentSelectedTab
            };
        }
        /**
         * For all other scenarios don't change the selection.
         */
        return selectedSource;
    }
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
    _onCloseModal(id = '', type, screenShareAudio = false) {
        this.props.onSourceChoose(id, type, screenShareAudio);
        this.props.dispatch((0, actions_1.hideDialog)());
    }
    /**
     * Sets the currently selected DesktopCapturerSource.
     *
     * @param {string} id - The id of DesktopCapturerSource.
     * @param {string} type - The type of DesktopCapturerSource.
     * @returns {void}
     */
    _onPreviewClick(id, type) {
        this.setState({
            selectedSource: {
                id,
                type
            }
        });
    }
    /**
     * Request to close the modal and execute callbacks with the selected source
     * id.
     *
     * @returns {void}
     */
    _onSubmit() {
        const { selectedSource: { id, type }, screenShareAudio } = this.state;
        this._onCloseModal(id, type, screenShareAudio);
    }
    /**
     * Stores the selected tab and updates the selected source via
     * {@code _getSelectedSource}.
     *
     * @param {string} id - The id of the newly selected tab.
     * @returns {void}
     */
    _onTabSelected(id) {
        const { sources } = this.state;
        // When we change tabs also reset the screenShareAudio state so we don't
        // use the option from one tab when sharing from another.
        this.setState({
            screenShareAudio: false,
            selectedSource: this._getSelectedSource(sources, id),
            // select type `window` or `screen` from id
            selectedTab: id
        });
    }
    /**
     * Set the screenSharingAudio state indicating whether or not to also share
     * system audio.
     *
     * @param {boolean} checked - Share audio or not.
     * @returns {void}
     */
    _onShareAudioChecked(checked) {
        this.setState({ screenShareAudio: checked });
    }
    /**
     * Configures and renders the tabs for display.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderTabs() {
        const { types } = this.state;
        const { t } = this.props;
        const tabs = types.map(type => {
            return {
                accessibilityLabel: t(TAB_LABELS[type]),
                id: `${type}`,
                controlsId: `${type}-panel`,
                label: t(TAB_LABELS[type])
            };
        });
        return (react_1.default.createElement(Tabs_1.default, { accessibilityLabel: t('dialog.sharingTabs'), className: 'desktop-picker-tabs-container', onChange: this._onTabSelected, selected: `${this.state.selectedTab}`, tabs: tabs }));
    }
    /**
     * Create an interval to update known available DesktopCapturerSources.
     *
     * @private
     * @returns {void}
     */
    _startPolling() {
        this._stopPolling();
        this._updateSources();
        this._poller = window.setInterval(this._updateSources, UPDATE_INTERVAL);
    }
    /**
     * Cancels the interval to update DesktopCapturerSources.
     *
     * @private
     * @returns {void}
     */
    _stopPolling() {
        window.clearInterval(this._poller);
        this._poller = null;
    }
    /**
     * Obtains the desktop sources and updates state with them.
     *
     * @private
     * @returns {void}
     */
    _updateSources() {
        const { types } = this.state;
        const options = {
            types,
            thumbnailSize: constants_1.THUMBNAIL_SIZE
        };
        if (types.length > 0) {
            (0, functions_2.obtainDesktopSources)(options)
                .then((sources) => {
                const selectedSource = this._getSelectedSource(sources);
                this.setState({
                    selectedSource,
                    sources
                });
            })
                .catch((error) => logger_1.default.log(error));
        }
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(DesktopPicker));
