"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/dialog/actions");
const utils_1 = require("../../base/environment/utils");
const functions_2 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const functions_3 = require("../../jaas/functions");
const EmbedMeetingDialog_1 = __importDefault(require("./EmbedMeetingDialog"));
/**
 * Implementation of a button for opening embed meeting dialog.
 */
class EmbedMeetingButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.embedMeeting';
        this.icon = svg_1.IconCode;
        this.label = 'toolbar.embedMeeting';
        this.tooltip = 'toolbar.embedMeeting';
    }
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('embed.meeting'));
        dispatch((0, actions_1.openDialog)(EmbedMeetingDialog_1.default));
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
        visible: !(0, functions_3.isVpaasMeeting)(state) && !(0, utils_1.isMobileBrowser)()
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(EmbedMeetingButton));
