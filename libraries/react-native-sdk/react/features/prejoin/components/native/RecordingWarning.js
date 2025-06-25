"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const styles_1 = require("./styles");
const RecordingWarning = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<react_native_1.View style={styles_1.preJoinStyles.recordingWarning}>
            <react_native_1.Text numberOfLines={1} style={styles_1.preJoinStyles.recordingWarningText}>
                {t('prejoin.recordingWarning')}
            </react_native_1.Text>
        </react_native_1.View>);
};
exports.default = RecordingWarning;
