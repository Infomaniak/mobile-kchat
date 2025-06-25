"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const functions_2 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const ConferenceNavigationContainerRef_1 = require("../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../mobile/navigation/routes");
/**
 * Implements an {@link AbstractButton} to open the chat screen on mobile.
 */
class SharedDocumentButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.document';
        this.icon = svg_1.IconShareDoc;
        this.label = 'toolbar.documentOpen';
        this.tooltip = 'toolbar.documentOpen';
    }
    /**
     * Handles clicking / pressing the button, and opens / closes the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { handleClick } = this.props;
        if (handleClick) {
            handleClick();
            return;
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('toggle.etherpad', {
            enable: true
        }));
        (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.sharedDocument);
    }
}
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    const { documentUrl } = state['features/etherpad'];
    const { visible = Boolean(documentUrl) } = ownProps;
    return {
        visible
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(SharedDocumentButton));
