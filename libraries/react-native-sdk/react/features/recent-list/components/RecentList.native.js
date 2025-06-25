"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_native_1 = require("../../app/functions.native");
const actions_1 = require("../../base/dialog/actions");
const functions_1 = require("../../base/i18n/functions");
const NavigateSectionList_1 = __importDefault(require("../../base/react/components/native/NavigateSectionList"));
const styles_1 = __importDefault(require("../../welcome/components/styles"));
const functions_native_2 = require("../functions.native");
const AbstractRecentList_1 = __importDefault(require("./AbstractRecentList"));
const RecentListItemMenu_native_1 = __importDefault(require("./RecentListItemMenu.native"));
/**
 * A class that renders the list of the recently joined rooms.
 *
 */
class RecentList extends AbstractRecentList_1.default {
    /**
     * Initializes a new {@code RecentList} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onLongPress = this._onLongPress.bind(this);
    }
    /**
     * Implements the React Components's render method.
     *
     * @inheritdoc
     */
    render() {
        if (!(0, functions_native_2.isRecentListEnabled)()) {
            return null;
        }
        const { disabled, onListContainerPress, t, _defaultServerURL, _recentList } = this.props; // @ts-ignore
        const recentList = (0, functions_native_2.toDisplayableList)(_recentList, t, _defaultServerURL);
        return (<react_native_1.TouchableWithoutFeedback onPress={onListContainerPress}>
                <react_native_1.View style={(disabled ? styles_1.default.recentListDisabled : styles_1.default.recentList)}>
                    <NavigateSectionList_1.default disabled={disabled} onLongPress={this._onLongPress} onPress={this._onPress} renderListEmptyComponent={this._getRenderListEmptyComponent()} 
        // @ts-ignore
        sections={recentList}/>
                </react_native_1.View>
            </react_native_1.TouchableWithoutFeedback>);
    }
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {Object} item - The item which was long pressed.
     * @returns {void}
     */
    _onLongPress(item) {
        this.props.dispatch((0, actions_1.openSheet)(RecentListItemMenu_native_1.default, { item }));
    }
}
/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _defaultServerURL: (0, functions_native_1.getDefaultURL)(state),
        _recentList: state['features/recent-list']
    };
}
exports._mapStateToProps = _mapStateToProps;
// @ts-ignore
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(RecentList));
