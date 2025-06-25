"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const OverflowMenu_1 = __importDefault(require("./OverflowMenu"));
/**
 * An implementation of a button for showing the {@code OverflowMenu}.
 */
class OverflowMenuButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.moreActions';
        this.icon = svg_1.IconDotsHorizontal;
        this.label = 'toolbar.moreActions';
    }
    /**
     * Handles clicking / pressing this {@code OverflowMenuButton}.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch((0, actions_1.openSheet)(OverflowMenu_1.default));
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code OverflowMenuButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const enabledFlag = (0, functions_1.getFeatureFlag)(state, constants_1.OVERFLOW_MENU_ENABLED, true);
    return {
        visible: enabledFlag
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(OverflowMenuButton));
