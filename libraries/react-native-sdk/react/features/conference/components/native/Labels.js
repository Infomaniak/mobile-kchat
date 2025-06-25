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
const VideoQualityLabel_native_1 = __importDefault(require("../../../video-quality/components/VideoQualityLabel.native"));
const InsecureRoomNameLabel_1 = __importDefault(require("./InsecureRoomNameLabel"));
const constants_1 = require("./constants");
const styles_1 = __importDefault(require("./styles"));
/**
 * A container that renders the conference indicators, if any.
 */
class Labels extends react_1.Component {
    /**
     * Implements React {@code Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        return (<react_native_1.View pointerEvents='box-none'>
                <react_native_1.View pointerEvents='box-none' style={styles_1.default.indicatorContainer}>
                    <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={this.props.createOnPress(constants_1.LABEL_ID_INSECURE_ROOM_NAME)}>
                        <InsecureRoomNameLabel_1.default />
                    </react_native_1.TouchableOpacity>
                    <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={this.props.createOnPress(constants_1.LABEL_ID_QUALITY)}>
                        <VideoQualityLabel_native_1.default />
                    </react_native_1.TouchableOpacity>
                </react_native_1.View>
            </react_native_1.View>);
    }
}
exports.default = Labels;
