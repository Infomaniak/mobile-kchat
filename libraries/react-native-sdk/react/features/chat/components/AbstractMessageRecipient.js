"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = exports._mapDispatchToProps = void 0;
const react_1 = require("react");
const functions_1 = require("../../base/participants/functions");
const actions_any_1 = require("../actions.any");
/**
 * Abstract class for the {@code MessageRecipient} component.
 */
class AbstractMessageRecipient extends react_1.PureComponent {
}
exports.default = AbstractMessageRecipient;
/**
 * Maps part of the props of this component to Redux actions.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {IProps}
 */
function _mapDispatchToProps(dispatch) {
    return {
        _onRemovePrivateMessageRecipient: () => {
            dispatch((0, actions_any_1.setPrivateMessageRecipient)());
        },
        _onHideLobbyChatRecipient: () => {
            dispatch((0, actions_any_1.setLobbyChatActiveState)(false));
        }
    };
}
exports._mapDispatchToProps = _mapDispatchToProps;
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Components' own props.
 * @returns {IProps}
 */
function _mapStateToProps(state, _ownProps) {
    const { privateMessageRecipient, lobbyMessageRecipient, isLobbyChatActive } = state['features/chat'];
    return {
        _privateMessageRecipient: privateMessageRecipient ? (0, functions_1.getParticipantDisplayName)(state, privateMessageRecipient.id) : undefined,
        _isLobbyChatActive: isLobbyChatActive,
        _lobbyMessageRecipient: isLobbyChatActive && lobbyMessageRecipient ? lobbyMessageRecipient.name : undefined,
        _visible: isLobbyChatActive ? (0, functions_1.isLocalParticipantModerator)(state) : true
    };
}
exports._mapStateToProps = _mapStateToProps;
