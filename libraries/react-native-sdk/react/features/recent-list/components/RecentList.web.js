"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const MeetingsList_1 = __importDefault(require("../../base/react/components/web/MeetingsList"));
const actions_1 = require("../actions");
const functions_web_1 = require("../functions.web");
const AbstractRecentList_1 = __importDefault(require("./AbstractRecentList"));
/**
 * The cross platform container rendering the list of the recently joined rooms.
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
        this._getRenderListEmptyComponent
            = this._getRenderListEmptyComponent.bind(this);
        this._onPress = this._onPress.bind(this);
        this._onItemDelete = this._onItemDelete.bind(this);
    }
    /**
     * Deletes a recent entry.
     *
     * @param {Object} entry - The entry to be deleted.
     * @inheritdoc
     */
    _onItemDelete(entry) {
        this.props.dispatch((0, actions_1.deleteRecentListEntry)(entry));
    }
    /**
     * Implements the React Components's render method.
     *
     * @inheritdoc
     */
    render() {
        if (!(0, functions_web_1.isRecentListEnabled)()) {
            return null;
        }
        const { disabled, _recentList } = this.props;
        const recentList = (0, functions_web_1.toDisplayableList)(_recentList);
        return (react_1.default.createElement(MeetingsList_1.default, { disabled: Boolean(disabled), hideURL: true, listEmptyComponent: this._getRenderListEmptyComponent(), meetings: recentList, onItemDelete: this._onItemDelete, onPress: this._onPress }));
    }
}
/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _defaultServerURL: string,
 *     _recentList: Array
 * }}
 */
function _mapStateToProps(state) {
    return {
        _recentList: state['features/recent-list']
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(RecentList));
