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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const Dialog_1 = __importDefault(require("../../../../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../../../../base/ui/components/web/Input"));
const actions_1 = require("../../../../../breakout-rooms/actions");
/**
 * Implements a React {@code Component} for displaying a dialog with an field
 * for setting a breakout room's name.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
function BreakoutRoomNamePrompt({ breakoutRoomJid, initialRoomName }) {
    const [roomName, setRoomName] = (0, react_1.useState)(initialRoomName?.trim());
    const { t } = (0, react_i18next_1.useTranslation)();
    const okDisabled = !roomName;
    const dispatch = (0, react_redux_1.useDispatch)();
    const onBreakoutRoomNameChange = (0, react_1.useCallback)((newRoomName) => {
        setRoomName(newRoomName);
    }, [setRoomName]);
    const onSubmit = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.renameBreakoutRoom)(breakoutRoomJid, roomName?.trim()));
    }, [breakoutRoomJid, dispatch, roomName]);
    return (react_1.default.createElement(Dialog_1.default, { ok: {
            disabled: okDisabled,
            translationKey: 'dialog.Ok'
        }, onSubmit: onSubmit, titleKey: 'dialog.renameBreakoutRoomTitle' },
        react_1.default.createElement(Input_1.default, { autoFocus: true, className: 'dialog-bottom-margin', id: 'breakout-rooms-name-input', label: t('dialog.renameBreakoutRoomLabel'), name: 'breakoutRoomName', onChange: onBreakoutRoomNameChange, type: 'text', value: roomName })));
}
exports.default = BreakoutRoomNamePrompt;
