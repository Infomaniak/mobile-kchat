"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const ConnectionStatusComponent_1 = __importDefault(require("./ConnectionStatusComponent"));
/**
 * A remote video menu button which shows the connection statistics.
 */
class ConnectionStatusButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.icon = svg_1.IconInfoCircle;
        this.label = 'videothumbnail.connectionInfo';
    }
    /**
     * Handles clicking / pressing the button, and kicks the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        dispatch((0, actions_1.openSheet)(ConnectionStatusComponent_1.default, {
            participantID
        }));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(ConnectionStatusButton));
