"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Abstract component to display a list of chat messages, grouped by sender.
 *
 * @augments PureComponent
 */
class AbstractMessageContainer extends react_1.Component {
    /**
     * Iterates over all the messages and creates nested arrays which hold
     * consecutive messages sent by the same participant.
     *
     * @private
     * @returns {Array<Array<Object>>}
     */
    _getMessagesGroupedBySender() {
        const messagesCount = this.props.messages.length;
        const groups = [];
        let currentGrouping = [];
        let currentGroupParticipantId;
        for (let i = 0; i < messagesCount; i++) {
            const message = this.props.messages[i];
            if (message.id === currentGroupParticipantId) {
                currentGrouping.push(message);
            }
            else {
                currentGrouping.length && groups.push(currentGrouping);
                currentGrouping = [message];
                currentGroupParticipantId = message.id;
            }
        }
        currentGrouping.length && groups.push(currentGrouping);
        return groups;
    }
}
AbstractMessageContainer.defaultProps = {
    messages: []
};
exports.default = AbstractMessageContainer;
