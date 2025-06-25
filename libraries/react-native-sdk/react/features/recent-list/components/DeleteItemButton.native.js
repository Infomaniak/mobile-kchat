"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../actions");
/**
 * A recent list menu button which deletes the selected entry.
 */
class DeleteItemButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'welcomepage.recentListDelete';
        this.icon = svg_1.IconTrash;
        this.label = 'welcomepage.recentListDelete';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, itemId } = this.props;
        dispatch((0, actions_1.deleteRecentListEntry)(itemId));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(DeleteItemButton));
