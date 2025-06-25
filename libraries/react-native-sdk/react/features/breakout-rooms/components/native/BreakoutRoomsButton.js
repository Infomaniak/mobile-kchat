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
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
/**
 * Implements an {@link AbstractButton} to open the breakout room screen.
 */
class BreakoutRoomsButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.breakoutRooms';
        this.icon = svg_1.IconRingGroup;
        this.label = 'breakoutRooms.buttonLabel';
    }
    /**
     * Handles clicking / pressing the button and opens the breakout rooms screen.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.breakoutRooms);
    }
}
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {IReduxState} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.BREAKOUT_ROOMS_BUTTON_ENABLED, true);
    return {
        visible: enabled
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(BreakoutRoomsButton));
