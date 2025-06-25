"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_native_1 = require("../../actions.native");
const functions_4 = require("../../functions");
/**
 * Component that renders a toolbar button for toggling the tile layout view.
 *
 * @augments AbstractButton
 */
class VideoShareButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.sharedvideo';
        this.icon = svg_1.IconPlay;
        this.label = 'toolbar.sharedvideo';
        this.toggledLabel = 'toolbar.stopSharedVideo';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
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
        this.props.dispatch((0, actions_native_1.toggleSharedVideo)());
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { ownerId, status: sharedVideoStatus } = state['features/shared-video'];
    const localParticipantId = (0, functions_3.getLocalParticipant)(state)?.id;
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.VIDEO_SHARE_BUTTON_ENABLED, true);
    const { visible = enabled } = ownProps;
    if (ownerId !== localParticipantId) {
        return {
            _isDisabled: (0, functions_4.isSharingStatus)(sharedVideoStatus ?? ''),
            _sharingVideo: false,
            visible
        };
    }
    return {
        _isDisabled: false,
        _sharingVideo: (0, functions_4.isSharingStatus)(sharedVideoStatus ?? ''),
        visible
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(VideoShareButton));
