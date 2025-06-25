"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../../analytics/functions");
const functions_2 = require("../../../../base/i18n/functions");
const svg_1 = require("../../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../../base/toolbox/components/AbstractButton"));
const actions_any_1 = require("../../../actions.any");
/**
 * Implementation of a button for opening invite people dialog.
 */
class InviteButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.invite';
        this.icon = svg_1.IconAddUser;
        this.label = 'toolbar.invite';
        this.tooltip = 'toolbar.invite';
    }
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('invite'));
        dispatch((0, actions_any_1.beginAddPeople)());
    }
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)()(InviteButton));
