"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const actions_any_1 = require("../../actions.any");
const AbstractMessageRecipient_1 = __importDefault(require("../AbstractMessageRecipient"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Class to implement the displaying of the recipient of the next message.
 */
class MessageRecipient extends AbstractMessageRecipient_1.default {
    /**
     * Constructor of the component.
     *
     * @param {IProps} props - The props of the component.
     */
    constructor(props) {
        super(props);
        this._onResetPrivateMessageRecipient = this._onResetPrivateMessageRecipient.bind(this);
        this._onResetLobbyMessageRecipient = this._onResetLobbyMessageRecipient.bind(this);
    }
    /**
     * Resets lobby message recipient from state.
     *
     * @returns {void}
     */
    _onResetLobbyMessageRecipient() {
        const { dispatch } = this.props;
        dispatch((0, actions_any_1.setLobbyChatActiveState)(false));
    }
    /**
     * Resets private message recipient from state.
     *
     * @returns {void}
     */
    _onResetPrivateMessageRecipient() {
        const { dispatch } = this.props;
        dispatch((0, actions_any_1.setPrivateMessageRecipient)());
        (0, ConferenceNavigationContainerRef_1.setParams)({
            privateMessageRecipient: undefined
        });
    }
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isLobbyChatActive, lobbyMessageRecipient, privateMessageRecipient, t } = this.props;
        if (isLobbyChatActive) {
            return (<react_native_1.View style={styles_1.default.lobbyMessageRecipientContainer}>
                    <react_native_1.Text style={styles_1.default.messageRecipientText}>
                        {t('chat.lobbyChatMessageTo', {
                    recipient: lobbyMessageRecipient?.name
                })}
                    </react_native_1.Text>
                    <react_native_1.TouchableHighlight onPress={this._onResetLobbyMessageRecipient}>
                        <Icon_1.default src={svg_1.IconCloseLarge} style={styles_1.default.messageRecipientCancelIcon}/>
                    </react_native_1.TouchableHighlight>
                </react_native_1.View>);
        }
        if (!privateMessageRecipient) {
            return null;
        }
        return (<react_native_1.View style={styles_1.default.messageRecipientContainer}>
                <react_native_1.Text style={styles_1.default.messageRecipientText}>
                    {t('chat.messageTo', {
                recipient: privateMessageRecipient.name
            })}
                </react_native_1.Text>
                <react_native_1.TouchableHighlight onPress={this._onResetPrivateMessageRecipient} underlayColor={'transparent'}>
                    <Icon_1.default src={svg_1.IconCloseLarge} style={styles_1.default.messageRecipientCancelIcon}/>
                </react_native_1.TouchableHighlight>
            </react_native_1.View>);
    }
}
/**
 * Maps part of the redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Component's own props.
 * @returns {IProps}
 */
function _mapStateToProps(state, _ownProps) {
    const { lobbyMessageRecipient, isLobbyChatActive } = state['features/chat'];
    return {
        isLobbyChatActive,
        lobbyMessageRecipient
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(MessageRecipient));
