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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const ReactionButton_1 = __importDefault(require("../../../reactions/components/web/ReactionButton"));
const types_1 = require("../../../reactions/types");
const actions_1 = require("../../actions");
const functions_web_1 = require("../../functions.web");
const GifsMenuButton = ({ parent }) => {
    const menuOpen = (0, react_redux_1.useSelector)(functions_web_1.isGifsMenuOpen);
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const icon = (react_1.default.createElement("img", { alt: 'GIPHY Logo', height: parent === types_1.IReactionsMenuParent.OverflowMenu ? 16 : 24, src: 'images/GIPHY_icon.png' }));
    const handleClick = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.setGifMenuVisibility)(!menuOpen));
    }, [menuOpen, parent]);
    return (react_1.default.createElement(ReactionButton_1.default, { accessibilityLabel: t('toolbar.accessibilityLabel.giphy'), icon: icon, key: 'gif', onClick: handleClick, toggled: true, tooltip: t('toolbar.accessibilityLabel.giphy') }));
};
exports.default = GifsMenuButton;
