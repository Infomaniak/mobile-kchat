"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../../base/dialog/actions");
const AlertDialog_1 = __importDefault(require("../../../../base/dialog/components/native/AlertDialog"));
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../../base/modal/components/JitsiScreen"));
const AvatarListItem_1 = __importDefault(require("../../../../base/react/components/native/AvatarListItem"));
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
const Input_1 = __importDefault(require("../../../../base/ui/components/native/Input"));
const HeaderNavigationButton_1 = __importDefault(require("../../../../mobile/navigation/components/HeaderNavigationButton"));
const actions_2 = require("../../../../share-room/actions");
const constants_1 = require("../../../constants");
const AbstractAddPeopleDialog_1 = __importStar(require("../AbstractAddPeopleDialog"));
const styles_1 = __importStar(require("./styles"));
/**
 * Implements a special dialog to invite people from a directory service.
 */
class AddPeopleDialog extends AbstractAddPeopleDialog_1.default {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        /**
         * Default state object to reset the state to when needed.
         */
        this.defaultState = {
            addToCallError: false,
            addToCallInProgress: false,
            bottomPadding: false,
            fieldValue: '',
            inviteItems: [],
            searchInprogress: false,
            selectableItems: []
        };
        this.state = this.defaultState;
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderInvitedItem = this._renderInvitedItem.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderSeparator = this._renderSeparator.bind(this);
        this._onClearField = this._onClearField.bind(this);
        this._onInvite = this._onInvite.bind(this);
        this._onPressItem = this._onPressItem.bind(this);
        this._onShareMeeting = this._onShareMeeting.bind(this);
        this._onTypeQuery = this._onTypeQuery.bind(this);
        this._renderShareMeetingButton = this._renderShareMeetingButton.bind(this);
        this._renderIcon = this._renderIcon.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const { navigation, t } = this.props;
        navigation.setOptions({
            headerRight: () => (<HeaderNavigationButton_1.default disabled={this._isAddDisabled()} label={t('inviteDialog.send')} style={styles_1.default.sendBtn} twoActions={true}/>)
        });
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const { navigation, t } = this.props;
        navigation.setOptions({
            // eslint-disable-next-line react/no-multi-comp
            headerRight: () => (<HeaderNavigationButton_1.default disabled={this._isAddDisabled()} label={t('inviteDialog.send')} onPress={this._onInvite} style={styles_1.default.sendBtn} twoActions={true}/>)
        });
        if (prevProps._isVisible !== this.props._isVisible) {
            // Clear state
            this._clearState();
        }
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _addPeopleEnabled, _dialOutEnabled } = this.props;
        const { inviteItems, selectableItems } = this.state;
        let placeholderKey = 'searchPlaceholder';
        if (!_addPeopleEnabled) {
            placeholderKey = 'searchCallOnlyPlaceholder';
        }
        else if (!_dialOutEnabled) {
            placeholderKey = 'searchPeopleOnlyPlaceholder';
        }
        return (<JitsiScreen_1.default footerComponent={this._renderShareMeetingButton} hasExtraHeaderHeight={true} style={styles_1.default.addPeopleContainer}>
                <Input_1.default autoFocus={false} clearable={true} customStyles={{ container: styles_1.default.customContainer }} icon={this._renderIcon} onChange={this._onTypeQuery} placeholder={this.props.t(`inviteDialog.${placeholderKey}`)} value={this.state.fieldValue}/>
                {Boolean(inviteItems.length) && <react_native_1.View style={styles_1.default.invitedList}>
                    <react_native_1.FlatList data={inviteItems} horizontal={true} keyExtractor={this._keyExtractor} renderItem={this._renderInvitedItem}/>
                </react_native_1.View>}
                <react_native_1.View style={styles_1.default.resultList}>
                    <react_native_1.FlatList ItemSeparatorComponent={this._renderSeparator} data={selectableItems} extraData={inviteItems} keyExtractor={this._keyExtractor} renderItem={this._renderItem}/>
                </react_native_1.View>
            </JitsiScreen_1.default>);
    }
    /**
     * Clears the dialog content.
     *
     * @returns {void}
     */
    _clearState() {
        this.setState(this.defaultState);
    }
    /**
     * Returns an object capable of being rendered by an {@code AvatarListItem}.
     *
     * @param {Object} flatListItem - An item of the data array of the {@code FlatList}.
     * @returns {?Object}
     */
    _getRenderableItem(flatListItem) {
        const { item } = flatListItem;
        switch (item.type) {
            case constants_1.INVITE_TYPES.PHONE:
                return {
                    avatar: svg_1.IconPhoneRinging,
                    key: item.number,
                    title: item.number
                };
            case constants_1.INVITE_TYPES.USER:
                return {
                    avatar: item.avatar,
                    key: item.id || item.user_id,
                    title: item.name
                };
            default:
                return null;
        }
    }
    /**
     * Key extractor for the flatlist.
     *
     * @param {Object} item - The flatlist item that we need the key to be
     * generated for.
     * @returns {string}
     */
    _keyExtractor(item) {
        return item.type === constants_1.INVITE_TYPES.USER ? item.id || item.user_id : item.number;
    }
    /**
     * Callback to clear the text field.
     *
     * @returns {void}
     */
    _onClearField() {
        this.setState({
            fieldValue: ''
        });
        // Clear search results
        this._onTypeQuery('');
    }
    /**
     * Invites the selected entries.
     *
     * @returns {void}
     */
    _onInvite() {
        // @ts-ignore
        this._invite(this.state.inviteItems)
            .then((invitesLeftToSend) => {
            if (invitesLeftToSend.length) {
                this.setState({
                    inviteItems: invitesLeftToSend
                });
                this._showFailedInviteAlert();
            }
        });
    }
    /**
     * Function to prepare a callback for the onPress event of the touchable.
     *
     * @param {Item} item - The item on which onPress was invoked.
     * @returns {Function}
     */
    _onPressItem(item) {
        return () => {
            const { inviteItems } = this.state;
            const finderKey = item.type === constants_1.INVITE_TYPES.PHONE ? 'number' : 'user_id';
            if (inviteItems.find(lodash_1.default.matchesProperty(finderKey, item[finderKey]))) {
                // Item is already selected, need to unselect it.
                this.setState({
                    inviteItems: inviteItems.filter((element) => item[finderKey] !== element[finderKey])
                });
            }
            else {
                // Item is not selected yet, need to add to the list.
                // @ts-ignore
                const items = inviteItems.concat(item);
                this.setState({
                    inviteItems: lodash_1.default.sortBy(items, ['name', 'number'])
                });
            }
        };
    }
    /**
     * Shows the system share sheet to share the meeting information.
     *
     * @returns {void}
     */
    _onShareMeeting() {
        if (this.state.inviteItems.length > 0) {
            // The use probably intended to invite people.
            this._onInvite();
        }
        else {
            this.props.dispatch((0, actions_2.beginShareRoom)());
        }
    }
    /**
     * Handles the typing event of the text field on the dialog and performs the
     * search.
     *
     * @param {string} query - The query that is typed in the field.
     * @returns {void}
     */
    _onTypeQuery(query) {
        this.setState({
            fieldValue: query
        });
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.setState({
                searchInprogress: true
            }, () => {
                this._performSearch(query);
            });
        }, 500);
    }
    /**
     * Performs the actual search.
     *
     * @param {string} query - The query to search for.
     * @returns {void}
     */
    _performSearch(query) {
        this._query(query).then(results => {
            this.setState({
                selectableItems: lodash_1.default.sortBy(results, ['name', 'number'])
            });
        })
            .finally(() => {
            this.setState({
                searchInprogress: false
            });
        });
    }
    /**
     * Renders a single item in the invited {@code FlatList}.
     *
     * @param {Object} flatListItem - An item of the data array of the
     * {@code FlatList}.
     * @param {number} index - The index of the currently rendered item.
     * @returns {ReactElement<any>}
     */
    _renderInvitedItem(flatListItem, index) {
        const { item } = flatListItem;
        const renderableItem = this._getRenderableItem(flatListItem);
        return (<react_native_1.TouchableOpacity onPress={this._onPressItem(item)}>
                <react_native_1.View pointerEvents='box-only' style={styles_1.default.itemWrapper}>
                    <AvatarListItem_1.default avatarOnly={true} avatarSize={styles_1.AVATAR_SIZE} avatarStatus={item.status} avatarStyle={styles_1.default.avatar} avatarTextStyle={styles_1.default.avatarText} item={renderableItem} key={index} linesStyle={styles_1.default.itemLinesStyle} titleStyle={styles_1.default.itemText}/>
                    <Icon_1.default src={svg_1.IconCloseCircle} style={styles_1.default.unselectIcon}/>
                </react_native_1.View>
            </react_native_1.TouchableOpacity>);
    }
    /**
     * Renders a single item in the search result {@code FlatList}.
     *
     * @param {Object} flatListItem - An item of the data array of the
     * {@code FlatList}.
     * @param {number} index - The index of the currently rendered item.
     * @returns {?ReactElement<*>}
     */
    _renderItem(flatListItem, index) {
        const { item } = flatListItem;
        const { inviteItems } = this.state;
        let selected = false;
        const renderableItem = this._getRenderableItem(flatListItem);
        if (!renderableItem) {
            return null;
        }
        switch (item.type) {
            case constants_1.INVITE_TYPES.PHONE:
                selected = inviteItems.find(lodash_1.default.matchesProperty('number', item.number));
                break;
            case constants_1.INVITE_TYPES.USER:
                selected = item.id
                    ? inviteItems.find(lodash_1.default.matchesProperty('id', item.id))
                    : inviteItems.find(lodash_1.default.matchesProperty('user_id', item.user_id));
                break;
            default:
                return null;
        }
        return (<react_native_1.TouchableOpacity onPress={this._onPressItem(item)}>
                <react_native_1.View pointerEvents='box-only' style={styles_1.default.itemWrapper}>
                    <AvatarListItem_1.default avatarSize={styles_1.AVATAR_SIZE} avatarStatus={item.status} avatarStyle={styles_1.default.avatar} avatarTextStyle={styles_1.default.avatarText} item={renderableItem} key={index} linesStyle={styles_1.default.itemLinesStyle} titleStyle={styles_1.default.itemText}/>
                    {selected && <Icon_1.default src={svg_1.IconCheck} style={styles_1.default.selectedIcon}/>}
                </react_native_1.View>
            </react_native_1.TouchableOpacity>);
    }
    /**
     * Renders the item separator.
     *
     * @returns {?ReactElement<*>}
     */
    _renderSeparator() {
        return (<react_native_1.View style={styles_1.default.separator}/>);
    }
    /**
     * Renders a button to share the meeting info.
     *
     * @returns {React#Element<*>}
     */
    _renderShareMeetingButton() {
        return (<react_native_1.SafeAreaView style={[
                styles_1.default.bottomBar,
                this.state.bottomPadding ? styles_1.default.extraBarPadding : null
            ]}>
                <react_native_1.TouchableOpacity onPress={this._onShareMeeting}>
                    <Icon_1.default src={svg_1.IconShare} style={styles_1.default.shareIcon}/>
                </react_native_1.TouchableOpacity>
            </react_native_1.SafeAreaView>);
    }
    /**
     * Renders an icon.
     *
     * @returns {React#Element<*>}
     */
    _renderIcon() {
        if (this.state.searchInprogress) {
            return (<react_native_1.ActivityIndicator color={BaseTheme_native_1.default.palette.icon01} size='small'/>);
        }
        return (<Icon_1.default src={svg_1.IconSearch} style={styles_1.default.searchIcon}/>);
    }
    /**
     * Shows an alert telling the user that some invitees were failed to be
     * invited.
     *
     * NOTE: We're using an Alert here because we're on a modal and it makes
     * using our dialogs a tad more difficult.
     *
     * @returns {void}
     */
    _showFailedInviteAlert() {
        this.props.dispatch((0, actions_1.openDialog)(AlertDialog_1.default, {
            contentKey: {
                key: 'inviteDialog.alertText'
            }
        }));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Component's own props.
 * @returns {{
 *     _isVisible: boolean
 * }}
 */
function _mapStateToProps(state, _ownProps) {
    return {
        ...(0, AbstractAddPeopleDialog_1._mapStateToProps)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(AddPeopleDialog));
