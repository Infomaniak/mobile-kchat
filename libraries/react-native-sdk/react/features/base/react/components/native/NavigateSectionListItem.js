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
const svg_1 = require("../../../icons/svg");
const IconButton_1 = __importDefault(require("../../../ui/components/native/IconButton"));
const constants_any_1 = require("../../../ui/constants.any");
const AvatarListItem_1 = __importDefault(require("./AvatarListItem"));
const Text_1 = __importDefault(require("./Text"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a React/Native {@link Component} that renders the Navigate Section
 * List Item.
 *
 * @augments Component
 */
class NavigateSectionListItem extends react_1.Component {
    /**
     * Constructor of the NavigateSectionList component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._renderItemLine = this._renderItemLine.bind(this);
        this._renderItemLines = this._renderItemLines.bind(this);
    }
    /**
     * Renders a single line from the additional lines.
     *
     * @param {string} line - The line text.
     * @param {number} index - The index of the line.
     * @private
     * @returns {React$Node}
     */
    _renderItemLine(line, index) {
        if (!line) {
            return null;
        }
        return (<Text_1.default key={index} numberOfLines={1} style={styles_1.default.listItemText}>
                {line}
            </Text_1.default>);
    }
    /**
     * Renders the additional item lines, if any.
     *
     * @param {Array<string>} lines - The lines to render.
     * @private
     * @returns {Array<React$Node>}
     */
    _renderItemLines(lines) {
        return lines?.length ? lines.map(this._renderItemLine) : null;
    }
    /**
     * Renders the secondary action label.
     *
     * @private
     * @returns {React$Node}
     */
    _renderSecondaryAction() {
        const { secondaryAction } = this.props;
        return (<IconButton_1.default onPress={secondaryAction} src={svg_1.IconPlus} type={constants_any_1.BUTTON_TYPES.PRIMARY}/>);
    }
    /**
     * Renders the content of this component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { item, onLongPress, onPress, secondaryAction } = this.props;
        return (<AvatarListItem_1.default item={item} onLongPress={onLongPress} onPress={onPress}>
                {secondaryAction && this._renderSecondaryAction()}
            </AvatarListItem_1.default>);
    }
}
exports.default = NavigateSectionListItem;
