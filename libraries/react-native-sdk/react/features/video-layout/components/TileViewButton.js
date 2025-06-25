"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const constants_1 = require("../../base/flags/constants");
const functions_2 = require("../../base/flags/functions");
const functions_3 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../toolbox/actions");
const actions_2 = require("../actions");
const functions_4 = require("../functions");
const logger_1 = __importDefault(require("../logger"));
/**
 * Component that renders a toolbar button for toggling the tile layout view.
 *
 * @augments AbstractButton
 */
class TileViewButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.enterTileView';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.exitTileView';
        this.icon = svg_1.IconTileView;
        this.label = 'toolbar.enterTileView';
        this.toggledLabel = 'toolbar.exitTileView';
        this.tooltip = 'toolbar.tileViewToggle';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { _tileViewEnabled, dispatch } = this.props;
        const value = !_tileViewEnabled;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('tileview.button', {
            'is_enabled': value
        }));
        logger_1.default.debug(`Tile view ${value ? 'enable' : 'disable'}`);
        (0, react_redux_1.batch)(() => {
            dispatch((0, actions_2.setTileView)(value));
            navigator.product !== 'ReactNative' && dispatch((0, actions_1.setOverflowMenuVisible)(false));
        });
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._tileViewEnabled;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code TileViewButton} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const enabled = (0, functions_2.getFeatureFlag)(state, constants_1.TILE_VIEW_ENABLED, true);
    const { visible = enabled } = ownProps;
    return {
        _tileViewEnabled: (0, functions_4.shouldDisplayTileView)(state),
        visible
    };
}
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(TileViewButton));
