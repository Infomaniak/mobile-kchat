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
const functions_1 = require("../../../../base/i18n/functions");
const Select_1 = __importDefault(require("../../../../base/ui/components/web/Select"));
const constants_1 = require("../constants");
/**
 * A dropdown to select a YouTube broadcast.
 *
 * @augments Component
 */
class StreamKeyPicker extends react_1.PureComponent {
    /**
     * Initializes a new {@code StreamKeyPicker} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code StreamKeyPicker} instance with.
     */
    constructor(props) {
        super(props);
        /**
         * The initial state of a {@code StreamKeyForm} instance.
         */
        this.state = {
            isDropdownOpen: false
        };
        // Bind event handlers so they are only bound once per instance.
        this._onSelect = this._onSelect.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { broadcasts, selectedBoundStreamID, t } = this.props;
        if (!broadcasts.length) {
            return (react_1.default.createElement("a", { className: 'warning-text', href: constants_1.YOUTUBE_LIVE_DASHBOARD_URL, rel: 'noopener noreferrer', target: '_blank' }, t('liveStreaming.getStreamKeyManually')));
        }
        const dropdownItems = broadcasts.map(broadcast => {
            return {
                value: broadcast.boundStreamID,
                label: broadcast.title
            };
        });
        return (react_1.default.createElement("div", { className: 'broadcast-dropdown dropdown-menu' },
            react_1.default.createElement(Select_1.default, { id: 'streamkeypicker-select', label: t('liveStreaming.choose'), onChange: this._onSelect, options: dropdownItems, value: selectedBoundStreamID ?? '' })));
    }
    /**
     * Callback invoked when an item has been clicked in the dropdown menu.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onSelect(e) {
        const streamId = e.target.value;
        this.props.onBroadcastSelected(streamId);
    }
}
/**
 * Default values for {@code StreamKeyForm} component's properties.
 *
 * @static
 */
StreamKeyPicker.defaultProps = {
    broadcasts: []
};
exports.default = (0, functions_1.translate)(StreamKeyPicker);
