"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const AbstractMessageContainer_1 = __importDefault(require("../AbstractMessageContainer"));
const ChatMessageGroup_1 = __importDefault(require("./ChatMessageGroup"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a container to render all the chat messages in a conference.
 */
class MessageContainer extends AbstractMessageContainer_1.default {
    /**
     * Instantiates a new instance of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListEmptyComponent = this._renderListEmptyComponent.bind(this);
        this._renderMessageGroup = this._renderMessageGroup.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const data = this._getMessagesGroupedBySender();
        return (<react_native_1.FlatList ListEmptyComponent={this._renderListEmptyComponent} bounces={false} data={data} 
        // Workaround for RN bug:
        // https://github.com/facebook/react-native/issues/21196
        inverted={Boolean(data.length)} keyExtractor={this._keyExtractor} keyboardShouldPersistTaps='handled' renderItem={this._renderMessageGroup}/>);
    }
    /**
     * Key extractor for the flatlist.
     *
     * @param {Object} _item - The flatlist item that we need the key to be
     * generated for.
     * @param {number} index - The index of the element.
     * @returns {string}
     */
    _keyExtractor(_item, index) {
        return `key_${index}`;
    }
    /**
     * Renders a message when there are no messages in the chat yet.
     *
     * @returns {React$Element<any>}
     */
    _renderListEmptyComponent() {
        const { t } = this.props;
        return (<react_native_1.View style={styles_1.default.emptyComponentWrapper}>
                <react_native_1.Text style={styles_1.default.emptyComponentText}>
                    {t('chat.noMessagesMessage')}
                </react_native_1.Text>
            </react_native_1.View>);
    }
    /**
     * Renders a single chat message.
     *
     * @param {Array<Object>} messages - The chat message to render.
     * @returns {React$Element<*>}
     */
    _renderMessageGroup({ item: messages }) {
        return <ChatMessageGroup_1.default messages={messages}/>;
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(MessageContainer));
