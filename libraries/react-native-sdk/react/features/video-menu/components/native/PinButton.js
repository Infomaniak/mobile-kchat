"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const actions_1 = require("../../../base/participants/actions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const functions_2 = require("../../../video-layout/functions");
/**
 * A remote video menu button which pins a participant and exist the tile view.
 */
class PinButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.show';
        this.icon = svg_1.IconEnlarge;
        this.label = 'videothumbnail.show';
    }
    /**
     * Handles clicking / pressing the button, and kicks the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        // Pin participant, it will automatically exit the tile view
        dispatch((0, actions_1.pinParticipant)(this.props.participantID));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { isOpen } = state['features/participants-pane'];
    return {
        visible: !isOpen && (0, functions_2.shouldDisplayTileView)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(PinButton));
