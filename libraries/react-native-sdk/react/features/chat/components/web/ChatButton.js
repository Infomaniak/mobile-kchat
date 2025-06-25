"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_web_1 = require("../../../toolbox/actions.web");
const actions_web_2 = require("../../actions.web");
const ChatCounter_1 = __importDefault(require("./ChatCounter"));
/**
 * Implementation of a button for accessing chat pane.
 */
class ChatButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.openChat';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.closeChat';
        this.icon = svg_1.IconMessage;
        this.label = 'toolbar.openChat';
        this.toggledLabel = 'toolbar.closeChat';
        this.tooltip = 'toolbar.openChat';
        this.toggledTooltip = 'toolbar.closeChat';
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._chatOpen;
    }
    /**
     * Overrides AbstractButton's {@link Component#render()}.
     *
     * @override
     * @protected
     * @returns {boReact$Nodeolean}
     */
    render() {
        return (react_1.default.createElement("div", { className: 'toolbar-button-with-badge', key: 'chatcontainer' },
            super.render(),
            react_1.default.createElement(ChatCounter_1.default, null)));
    }
    /**
     * Handles clicking the button, and toggles the chat.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('toggle.chat', {
            enable: !this.props._chatOpen
        }));
        dispatch((0, actions_web_1.closeOverflowMenuIfOpen)());
        dispatch((0, actions_web_2.toggleChat)());
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
        _chatOpen: state['features/chat'].isOpen
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(ChatButton));
