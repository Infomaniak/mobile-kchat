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
const dateUtil_1 = require("../../../i18n/dateUtil");
const functions_1 = require("../../../i18n/functions");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const svg_1 = require("../../../icons/svg");
const Container_1 = __importDefault(require("./Container"));
const Text_1 = __importDefault(require("./Text"));
/**
 * Generates a date string for a given date.
 *
 * @param {Object} date - The date.
 * @private
 * @returns {string}
 */
function _toDateString(date) {
    return (0, dateUtil_1.getLocalizedDateFormatter)(date).format('ll');
}
/**
 * Generates a time (interval) string for a given times.
 *
 * @param {Array<Date>} times - Array of times.
 * @private
 * @returns {string}
 */
function _toTimeString(times) {
    if (times && times.length > 0) {
        return (times
            .map(time => (0, dateUtil_1.getLocalizedDateFormatter)(time).format('LT'))
            .join(' - '));
    }
    return undefined;
}
/**
 * Implements a React/Web {@link Component} for displaying a list with
 * meetings.
 *
 * @augments Component
 */
class MeetingsList extends react_1.Component {
    /**
     * Constructor of the MeetingsList component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onPress = this._onPress.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }
    /**
     * Renders the content of this component.
     *
     * @returns {React.ReactNode}
     */
    render() {
        const { listEmptyComponent, meetings } = this.props;
        /**
         * If there are no recent meetings we don't want to display anything.
         */
        if (meetings) {
            return (react_1.default.createElement(Container_1.default, { className: 'meetings-list' }, meetings.length === 0
                ? listEmptyComponent
                : meetings.map(this._renderItem)));
        }
        return null;
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
        return undefined;
    }
    /**
     * Returns a function that is used in the onPress callback of the items.
     *
     * @param {string} url - The URL of the item to navigate to.
     * @private
     * @returns {Function}
     */
    _onKeyPress(url) {
        const { disabled, onPress } = this.props;
        if (!disabled && url && typeof onPress === 'function') {
            return (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    onPress(url);
                }
            };
        }
        return undefined;
    }
    /**
     * Returns a function that is used on the onDelete callback.
     *
     * @param {Object} item - The item to be deleted.
     * @private
     * @returns {Function}
     */
    _onDelete(item) {
        const { onItemDelete } = this.props;
        return (evt) => {
            evt?.stopPropagation();
            onItemDelete?.(item);
        };
    }
    /**
     * Returns a function that is used on the onDelete keypress callback.
     *
     * @param {Object} item - The item to be deleted.
     * @private
     * @returns {Function}
     */
    _onDeleteKeyPress(item) {
        const { onItemDelete } = this.props;
        return (e) => {
            if (onItemDelete && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                e.stopPropagation();
                onItemDelete(item);
            }
        };
    }
    /**
     * Renders an item for the list.
     *
     * @param {Object} meeting - Information about the meeting.
     * @param {number} index - The index of the item.
     * @returns {Node}
     */
    _renderItem(meeting, index) {
        const { date, duration, elementAfter, time, title, url } = meeting;
        const { hideURL = false, onItemDelete, t } = this.props;
        const onPress = this._onPress(url);
        const onKeyPress = this._onKeyPress(url);
        const rootClassName = `item ${onPress ? 'with-click-handler' : 'without-click-handler'}`;
        return (react_1.default.createElement(Container_1.default, { className: rootClassName, key: index, onClick: onPress },
            react_1.default.createElement(Container_1.default, { className: 'right-column' },
                react_1.default.createElement(Text_1.default, { className: 'title', onClick: onPress, onKeyPress: onKeyPress, role: 'button', tabIndex: 0 }, title),
                hideURL || !url ? null : (react_1.default.createElement(Text_1.default, null, url)),
                typeof duration === 'number' ? (react_1.default.createElement(Text_1.default, { className: 'subtitle' }, (0, dateUtil_1.getLocalizedDurationFormatter)(duration))) : null),
            react_1.default.createElement(Container_1.default, { className: 'left-column' },
                react_1.default.createElement(Text_1.default, { className: 'title' }, _toDateString(date)),
                react_1.default.createElement(Text_1.default, { className: 'subtitle' }, _toTimeString(time))),
            react_1.default.createElement(Container_1.default, { className: 'actions' },
                elementAfter || null,
                onItemDelete && react_1.default.createElement(Icon_1.default, { ariaLabel: t('welcomepage.recentListDelete'), className: 'delete-meeting', onClick: this._onDelete(meeting), onKeyPress: this._onDeleteKeyPress(meeting), role: 'button', src: svg_1.IconTrash, tabIndex: 0 }))));
    }
}
exports.default = (0, functions_1.translate)(MeetingsList);
