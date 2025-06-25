"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const utils_1 = require("../../../base/environment/utils");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_web_1 = require("../../actions.web");
/**
 * Implementation of a button for toggling fullscreen state.
 */
class FullscreenButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.enterFullScreen';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.exitFullScreen';
        this.label = 'toolbar.enterFullScreen';
        this.toggledLabel = 'toolbar.exitFullScreen';
        this.tooltip = 'toolbar.enterFullScreen';
        this.toggledTooltip = 'toolbar.exitFullScreen';
        this.toggledIcon = svg_1.IconExitFullscreen;
        this.icon = svg_1.IconEnterFullscreen;
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._fullScreen;
    }
    /**
    * Handles clicking the button, and toggles fullscreen.
    *
    * @private
    * @returns {void}
    */
    _handleClick() {
        const { dispatch, _fullScreen } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('toggle.fullscreen', {
            enable: !_fullScreen
        }));
        dispatch((0, actions_web_1.closeOverflowMenuIfOpen)());
        dispatch((0, actions_web_1.setFullScreen)(!_fullScreen));
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
    return {
        _fullScreen: state['features/toolbox'].fullScreen,
        visible: !(0, utils_1.isIosMobileBrowser)()
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(FullscreenButton));
