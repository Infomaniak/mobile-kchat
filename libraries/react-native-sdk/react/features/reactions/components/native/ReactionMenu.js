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
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const functions_native_1 = require("../../../gifs/functions.native");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const constants_1 = require("../../constants");
const RaiseHandButton_1 = __importDefault(require("./RaiseHandButton"));
const ReactionButton_1 = __importDefault(require("./ReactionButton"));
/**
 * Animated reaction emoji.
 *
 * @returns {ReactElement}
 */
function ReactionMenu({ onCancel, overflowMenu }) {
    const _styles = (0, react_redux_1.useSelector)((state) => ColorSchemeRegistry_1.default.get(state, 'Toolbox'));
    const gifEnabled = (0, react_redux_1.useSelector)(functions_native_1.isGifEnabled);
    const openGifMenu = (0, react_1.useCallback)(() => {
        (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.gifsMenu);
        onCancel();
    }, []);
    return (<react_native_1.View style={overflowMenu ? _styles.overflowReactionMenu : _styles.reactionMenu}>
            <react_native_1.View style={_styles.reactionRow}>
                {Object.keys(constants_1.REACTIONS).map(key => (<ReactionButton_1.default key={key} reaction={key} styles={_styles.reactionButton}/>))}
                {gifEnabled && (<ReactionButton_1.default onClick={openGifMenu} styles={_styles.reactionButton}>
                            <react_native_1.Image // @ts-ignore
         height={22} source={require('../../../../../images/GIPHY_icon.png')}/>
                        </ReactionButton_1.default>)}
            </react_native_1.View>
            <RaiseHandButton_1.default onCancel={onCancel}/>
        </react_native_1.View>);
}
exports.default = ReactionMenu;
