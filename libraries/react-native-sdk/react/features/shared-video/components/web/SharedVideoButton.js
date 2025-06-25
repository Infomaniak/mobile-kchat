"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_any_1 = require("../../actions.any");
const functions_2 = require("../../functions");
/**
 * Implements an {@link AbstractButton} to open the user documentation in a new window.
 */
class SharedVideoButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.sharedvideo';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.stopSharedVideo';
        this.icon = svg_1.IconPlay;
        this.label = 'toolbar.sharedvideo';
        this.toggledLabel = 'toolbar.stopSharedVideo';
        this.tooltip = 'toolbar.sharedvideo';
        this.toggledTooltip = 'toolbar.stopSharedVideo';
    }
    /**
     * Handles clicking / pressing the button, and opens a new dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this._doToggleSharedVideo();
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._sharingVideo;
    }
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._isDisabled;
    }
    /**
     * Dispatches an action to toggle video sharing.
     *
     * @private
     * @returns {void}
     */
    _doToggleSharedVideo() {
        this.props.dispatch((0, actions_any_1.toggleSharedVideo)());
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { disabled: sharedVideoBtnDisabled, status: sharedVideoStatus } = state['features/shared-video'];
    return {
        _isDisabled: Boolean(sharedVideoBtnDisabled),
        _sharingVideo: (0, functions_2.isSharingStatus)(sharedVideoStatus ?? '')
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(SharedVideoButton));
