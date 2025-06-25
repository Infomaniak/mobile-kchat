"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/conference/actions");
const functions_2 = require("../../base/i18n/functions");
const AbstractHangupButton_1 = __importDefault(require("../../base/toolbox/components/AbstractHangupButton"));
/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @augments AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton_1.default {
    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
        this.label = 'toolbar.hangup';
        this.tooltip = 'toolbar.hangup';
        this._hangup = lodash_1.default.once(() => {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('hangup'));
            this.props.dispatch((0, actions_1.leaveConference)());
        });
    }
    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        this._hangup();
    }
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)()(HangupButton));
