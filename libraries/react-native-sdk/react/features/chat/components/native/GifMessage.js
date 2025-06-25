"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const constants_1 = require("../../../gifs/constants");
const styles_1 = __importDefault(require("./styles"));
const GifMessage = ({ message }) => {
    const url = message.substring(constants_1.GIF_PREFIX.length, message.length - 1);
    return (<react_native_1.View style={styles_1.default.gifContainer}>
        <react_native_1.Image source={{ uri: url }} style={styles_1.default.gifImage}/>
    </react_native_1.View>);
};
exports.default = GifMessage;
