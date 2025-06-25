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
const react_redux_1 = require("react-redux");
const actions_1 = require("../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../base/dialog/components/native/BottomSheet"));
const styles_1 = require("../../base/dialog/components/native/styles");
const DeleteItemButton_native_1 = __importDefault(require("./DeleteItemButton.native"));
const ShowDialInInfoButton_native_1 = __importDefault(require("./ShowDialInInfoButton.native"));
const styles_native_1 = __importDefault(require("./styles.native"));
/**
 * Class to implement a popup menu that opens upon long pressing a recent list item.
 */
class RecentListItemMenu extends react_1.PureComponent {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onCancel = this._onCancel.bind(this);
        this._renderMenuHeader = this._renderMenuHeader.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { item } = this.props;
        const buttonProps = {
            afterClick: this._onCancel,
            itemId: item.id,
            showLabel: true,
            styles: styles_1.bottomSheetStyles.buttons
        };
        return (<BottomSheet_1.default renderHeader={this._renderMenuHeader}>
                <DeleteItemButton_native_1.default {...buttonProps}/>
                <ShowDialInInfoButton_native_1.default {...buttonProps}/>
            </BottomSheet_1.default>);
    }
    /**
     * Callback to hide this menu.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        this.props.dispatch((0, actions_1.hideSheet)());
    }
    /**
     * Function to render the menu's header.
     *
     * @returns {React$Element}
     */
    _renderMenuHeader() {
        const { item } = this.props;
        return (<react_native_1.View style={[
                styles_1.bottomSheetStyles.sheet,
                styles_native_1.default.entryNameContainer
            ]}>
                <react_native_1.Text ellipsizeMode={'middle'} numberOfLines={1} style={styles_native_1.default.entryNameLabel}>
                    {item.title}
                </react_native_1.Text>
            </react_native_1.View>);
    }
}
exports.default = (0, react_redux_1.connect)()(RecentListItemMenu);
