"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const EndMeetingButton_1 = __importDefault(require("./EndMeetingButton"));
const SoundDeviceButton_1 = __importDefault(require("./SoundDeviceButton"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the car mode footer component.
 *
 * @returns { JSX.Element} - The car mode footer component.
 */
const CarModeFooter = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<react_native_1.View pointerEvents='box-none' style={styles_1.default.bottomContainer}>
            <react_native_1.Text style={styles_1.default.videoStoppedLabel}>
                {t('carmode.labels.videoStopped')}
            </react_native_1.Text>
            <SoundDeviceButton_1.default />
            <EndMeetingButton_1.default />
        </react_native_1.View>);
};
exports.default = CarModeFooter;
