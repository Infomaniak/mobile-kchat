"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const functions_2 = require("../../screen-share/functions");
const actions_1 = require("../../settings/actions");
const constants_1 = require("../../settings/constants");
const functions_3 = require("../functions");
/**
 * An abstract implementation of a button that toggles the video background dialog.
 */
class VideoBackgroundButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.selectBackground';
        this.icon = svg_1.IconImage;
        this.label = 'toolbar.selectBackground';
        this.tooltip = 'toolbar.selectBackground';
    }
    /**
     * Handles clicking / pressing the button, and toggles the virtual background dialog
     * state accordingly.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        dispatch((0, actions_1.openSettingsDialog)(constants_1.SETTINGS_TABS.VIRTUAL_BACKGROUND));
    }
    /**
     * Returns {@code boolean} value indicating if the background effect is
     * enabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isBackgroundEnabled;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoBackgroundButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _isBackgroundEnabled: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        _isBackgroundEnabled: Boolean(state['features/virtual-background'].backgroundEffectEnabled),
        visible: (0, functions_3.checkBlurSupport)()
            && !(0, functions_2.isScreenVideoShared)(state)
            && (0, functions_3.checkVirtualBackgroundEnabled)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(VideoBackgroundButton));
