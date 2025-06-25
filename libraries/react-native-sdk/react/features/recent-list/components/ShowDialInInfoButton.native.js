"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const rootNavigationContainerRef_1 = require("../../mobile/navigation/rootNavigationContainerRef");
const routes_1 = require("../../mobile/navigation/routes");
/**
 * A recent list menu button which opens the dial-in info dialog.
 */
class ShowDialInInfoButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'welcomepage.info';
        this.icon = svg_1.IconInfoCircle;
        this.label = 'welcomepage.info';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { itemId } = this.props;
        (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.dialInSummary, {
            summaryUrl: itemId.url
        });
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(ShowDialInInfoButton));
