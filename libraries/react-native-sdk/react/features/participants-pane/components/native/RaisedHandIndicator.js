"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaisedHandIndicator = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const styles_1 = __importDefault(require("./styles"));
const RaisedHandIndicator = () => (<react_native_1.View style={styles_1.default.raisedHandIndicator}>
        <Icon_1.default size={16} src={svg_1.IconRaiseHand} style={styles_1.default.raisedHandIcon}/>
    </react_native_1.View>);
exports.RaisedHandIndicator = RaisedHandIndicator;
