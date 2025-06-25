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
const react_1 = __importStar(require("react"));
const NavigateSectionListEmptyComponent_1 = __importDefault(require("./NavigateSectionListEmptyComponent"));
const NavigateSectionListItem_1 = __importDefault(require("./NavigateSectionListItem"));
const NavigateSectionListSectionHeader_1 = __importDefault(require("./NavigateSectionListSectionHeader"));
const SectionList_1 = __importDefault(require("./SectionList"));
/**
 * Implements a general section list to display items that have a URL property
 * and navigates to (probably) meetings, such as the recent list or the meeting
 * list components.
 */
class NavigateSectionList extends react_1.Component {
    /**
     * Creates an empty section object.
     *
     * @param {string} title - The title of the section.
     * @param {string} key - The key of the section. It must be unique.
     * @private
     * @returns {Object}
     */
    static createSection(title, key) {
        const data = [];
        return {
            data,
            key,
            title
        };
    }
    /**
     * Constructor of the NavigateSectionList component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._getItemKey = this._getItemKey.bind(this);
        this._onLongPress = this._onLongPress.bind(this);
        this._onPress = this._onPress.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderListEmptyComponent = this._renderListEmptyComponent.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
    }
    /**
     * Implements React's {@code Component.render}.
     * Note: We don't use the refreshing value yet, because refreshing of these
     * lists is super quick, no need to complicate the code - yet.
     *
     * @inheritdoc
     */
    render() {
        const { renderListEmptyComponent = this._renderListEmptyComponent(), sections } = this.props;
        return (<SectionList_1.default ListEmptyComponent={renderListEmptyComponent} keyExtractor={this._getItemKey} 
        // @ts-ignore
        onItemClick={this.props.onPress} onRefresh={this._onRefresh} refreshing={false} renderItem={this._renderItem} renderSectionHeader={this._renderSectionHeader} sections={sections}/>);
    }
    /**
     * Generates a unique id to every item.
     *
     * @param {Object} item - The item.
     * @param {number} index - The item index.
     * @private
     * @returns {string}
     */
    _getItemKey(item, index) {
        return `${index}-${item.key}`;
    }
    /**
     * Returns a function that is used in the onLongPress callback of the items.
     *
     * @param {Object} item - The item that was long-pressed.
     * @private
     * @returns {Function}
     */
    _onLongPress(item) {
        const { disabled, onLongPress } = this.props;
        if (!disabled && typeof onLongPress === 'function') {
            return () => onLongPress(item);
        }
        return;
    }
    /**
     * Returns a function that is used in the onPress callback of the items.
     *
     * @param {string} url - The URL of the item to navigate to.
     * @private
     * @returns {Function}
     */
    _onPress(url) {
        const { disabled, onPress } = this.props;
        if (!disabled && url && typeof onPress === 'function') {
            return () => onPress(url);
        }
        return;
    }
    /**
     * Invokes the onRefresh callback if present.
     *
     * @private
     * @returns {void}
     */
    _onRefresh() {
        const { onRefresh } = this.props;
        if (typeof onRefresh === 'function') {
            onRefresh();
        }
    }
    /**
     * Returns a function that is used in the secondaryAction callback of the
     * items.
     *
     * @param {string} id - The id of the item that secondary action was
     * performed on.
     * @private
     * @returns {Function}
     */
    _onSecondaryAction(id) {
        return () => {
            this.props.onSecondaryAction(id);
        };
    }
    /**
     * Renders a single item in the list.
     *
     * @param {Object} listItem - The item to render.
     * @param {string} key - The item needed for rendering using map on web.
     * @private
     * @returns {Component}
     */
    _renderItem(listItem, key = '') {
        const { item } = listItem;
        const { id, url } = item;
        // XXX The value of title cannot be undefined; otherwise, react-native
        // will throw a TypeError: Cannot read property of undefined. While it's
        // difficult to get an undefined title and very likely requires the
        // execution of incorrect source code, it is undesirable to break the
        // whole app because of an undefined string.
        if (typeof item.title === 'undefined') {
            return <></>;
        }
        return (<NavigateSectionListItem_1.default item={item} key={key} onLongPress={url ? this._onLongPress(item) : undefined} onPress={url ? this._onPress(url) : undefined} secondaryAction={url ? undefined : this._onSecondaryAction(id)}/>);
    }
    /**
     * Renders a component to display when the list is empty.
     *
     * @param {Object} section - The section being rendered.
     * @private
     * @returns {React$Node}
     */
    _renderListEmptyComponent() {
        const { onRefresh } = this.props;
        if (typeof onRefresh === 'function') {
            return (<NavigateSectionListEmptyComponent_1.default />);
        }
        return <></>;
    }
    /**
     * Renders a section header.
     *
     * @param {Object} section - The section being rendered.
     * @private
     * @returns {React$Node}
     */
    _renderSectionHeader(section) {
        return (<NavigateSectionListSectionHeader_1.default section={section}/>);
    }
}
exports.default = NavigateSectionList;
