"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const AbstractVideoTrack_1 = __importDefault(require("../AbstractVideoTrack"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders video element for a specified video track.
 *
 * @augments AbstractVideoTrack
 */
class VideoTrack extends AbstractVideoTrack_1.default {
    /**
     * Renders the video element for the associated video track.
     *
     * @override
     * @returns {ReactElement}
     */
    render() {
        return (<react_native_1.View style={styles_1.default.video}>
                {super.render()}
            </react_native_1.View>);
    }
}
exports.default = (0, react_redux_1.connect)()(VideoTrack);
