"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Thumbnail_1 = __importDefault(require("./Thumbnail"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Component to render a local thumbnail that can be separated from the
 * remote thumbnails later.
 *
 * @returns {ReactElement}
 */
function LocalThumbnail() {
    return (<react_native_1.View style={styles_1.default.localThumbnail}>
            <Thumbnail_1.default />
        </react_native_1.View>);
}
exports.default = LocalThumbnail;
