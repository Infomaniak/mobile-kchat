"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = exports._mapDispatchToProps = exports.AbstractChatPrivacyDialog = void 0;
const react_1 = require("react");
const functions_1 = require("../../base/participants/functions");
const actions_1 = require("../actions");
/**
 * Abstract class for the dialog displayed to avoid mis-sending private messages.
 */
class AbstractChatPrivacyDialog extends react_1.PureComponent {
    /**
     * Instantiates a new instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onSendGroupMessage = this._onSendGroupMessage.bind(this);
        this._onSendPrivateMessage = this._onSendPrivateMessage.bind(this);
    }
    /**
     * Callback to be invoked for cancel action (user wants to send a group message).
     *
     * @returns {boolean}
     */
    _onSendGroupMessage() {
        this.props._onSendMessage(this.props.message);
        return true;
    }
    /**
     * Callback to be invoked for submit action (user wants to send a private message).
     *
     * @returns {void}
     */
    _onSendPrivateMessage() {
        const { message, _onSendMessage, _onSetMessageRecipient, _participant } = this.props;
        _onSetMessageRecipient(_participant);
        _onSendMessage(message);
        return true;
    }
}
exports.AbstractChatPrivacyDialog = AbstractChatPrivacyDialog;
/**
 * Maps part of the props of this component to Redux actions.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {IProps}
 */
function _mapDispatchToProps(dispatch) {
    return {
        _onSendMessage: (message) => {
            dispatch((0, actions_1.sendMessage)(message, true));
        },
        _onSetMessageRecipient: (participant) => {
            dispatch((0, actions_1.setPrivateMessageRecipient)(participant));
        }
    };
}
exports._mapDispatchToProps = _mapDispatchToProps;
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {IReduxState} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    return {
        _participant: (0, functions_1.getParticipantById)(state, ownProps.participantID)
    };
}
exports._mapStateToProps = _mapStateToProps;
