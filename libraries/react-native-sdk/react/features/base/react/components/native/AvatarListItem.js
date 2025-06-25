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
const react_native_1 = require("react-native");
const Avatar_1 = __importDefault(require("../../../avatar/components/Avatar"));
const Container_1 = __importDefault(require("./Container"));
const styles_1 = __importStar(require("./styles"));
/**
 * Implements a list item with an avatar rendered for it.
 */
class AvatarListItem extends react_1.Component {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._renderItemLine = this._renderItemLine.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { avatarOnly, avatarSize = styles_1.AVATAR_SIZE, avatarStatus, onLongPress, onPress } = this.props;
        const { avatar, colorBase, lines, title } = this.props.item;
        return (<Container_1.default onClick={onPress} onLongPress={onLongPress} style={styles_1.default.listItem} underlayColor={styles_1.UNDERLAY_COLOR}>
                <Avatar_1.default colorBase={colorBase} displayName={title} size={avatarSize} status={avatarStatus} url={avatar}/>
                {avatarOnly || <Container_1.default style={styles_1.default.listItemDetails}>
                    <react_native_1.Text numberOfLines={1} style={[
                    styles_1.default.listItemText,
                    styles_1.default.listItemTitle,
                    this.props.titleStyle
                ]}>
                        {title}
                    </react_native_1.Text>
                    {this._renderItemLines(lines)}
                </Container_1.default>}
                {this.props.children}
            </Container_1.default>);
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
        return (<react_native_1.Text key={index} numberOfLines={1} style={[
                styles_1.default.listItemText,
                this.props.linesStyle
            ]}>
                {line}
            </react_native_1.Text>);
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
}
exports.default = AvatarListItem;
