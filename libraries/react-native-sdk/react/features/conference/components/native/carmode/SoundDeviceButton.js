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
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../../base/dialog/actions");
const Button_1 = __importDefault(require("../../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../../base/ui/constants.native");
const AudioRoutePickerDialog_1 = __importDefault(require("../../../../mobile/audio-mode/components/AudioRoutePickerDialog"));
const AudioIcon_1 = __importDefault(require("./AudioIcon"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Button for selecting sound device in carmode.
 *
 * @returns {JSX.Element} - The sound device button.
 */
const SelectSoundDevice = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const onSelect = (0, react_1.useCallback)(() => dispatch((0, actions_1.openSheet)(AudioRoutePickerDialog_1.default)), [dispatch]);
    return (<Button_1.default accessibilityLabel='carmode.actions.selectSoundDevice' icon={AudioIcon_1.default} labelKey='carmode.actions.selectSoundDevice' onClick={onSelect} style={styles_1.default.soundDeviceButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>);
};
exports.default = SelectSoundDevice;
