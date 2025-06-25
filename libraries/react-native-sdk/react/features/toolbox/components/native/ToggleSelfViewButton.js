"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const actions_1 = require("../../../base/settings/actions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
/**
 * An implementation of a button for toggling the self view.
 */
class ToggleSelfViewButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.selfView';
        this.icon = svg_1.IconAudioOnlyOff;
        this.label = 'videothumbnail.hideSelfView';
        this.toggledLabel = 'videothumbnail.showSelfView';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { _disableSelfView, dispatch } = this.props;
        dispatch((0, actions_1.updateSettings)({
            disableSelfView: !_disableSelfView
        }));
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._disableSelfView;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleSelfViewButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disableSelfView: boolean
 * }}
 */
function _mapStateToProps(state) {
    const { disableSelfView } = state['features/base/settings'];
    return {
        _disableSelfView: Boolean(disableSelfView)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(ToggleSelfViewButton));
