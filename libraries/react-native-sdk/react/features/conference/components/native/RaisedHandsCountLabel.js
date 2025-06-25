"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../base/label/components/native/Label"));
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const styles_1 = __importDefault(require("./styles"));
const RaisedHandsCountLabel = () => {
    const raisedHandsCount = (0, react_redux_1.useSelector)((state) => (state['features/base/participants'].raisedHandsQueue || []).length);
    return raisedHandsCount > 0 ? (<Label_1.default icon={svg_1.IconRaiseHand} iconColor={BaseTheme_native_1.default.palette.uiBackground} style={styles_1.default.raisedHandsCountLabel} text={`${raisedHandsCount}`} textStyle={styles_1.default.raisedHandsCountLabelText}/>) : null;
};
exports.default = RaisedHandsCountLabel;
