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
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const Tooltip_1 = __importDefault(require("../../../../base/tooltip/components/Tooltip"));
const copyText_web_1 = require("../../../../base/util/copyText.web");
const actions_1 = require("../../../../notifications/actions");
const constants_1 = require("../../../../notifications/constants");
const _utils_1 = require("../../../_utils");
let mounted;
/**
 * Component responsible for displaying a telephone number and
 * conference ID for dialing into a conference and copying them to clipboard.
 *
 * @returns {ReactNode}
 */
function DialInNumber({ conferenceID, phoneNumber, t }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const [isClicked, setIsClicked] = (0, react_1.useState)(false);
    const dialInLabel = t('info.dialInNumber');
    const passcode = t('info.dialInConferenceID');
    const conferenceIDPin = `${(0, _utils_1._formatConferenceIDPin)(conferenceID)}#`;
    const textToCopy = `${dialInLabel} ${phoneNumber} ${passcode} ${conferenceIDPin}`;
    (0, react_1.useEffect)(() => {
        mounted = true;
        return () => {
            mounted = false;
        };
    }, []);
    /**
     * Copies the conference ID and phone number to the clipboard.
     *
     * @returns {void}
    */
    function _onCopyText() {
        (0, copyText_web_1.copyText)(textToCopy);
        dispatch((0, actions_1.showSuccessNotification)({
            titleKey: 'dialog.copied'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
        setIsClicked(true);
        setTimeout(() => {
            // avoid: Can't perform a React state update on an unmounted component
            if (mounted) {
                setIsClicked(false);
            }
        }, 2500);
    }
    /**
     * Copies the conference invitation to the clipboard.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    function _onCopyTextKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            _onCopyText();
        }
    }
    /**
     * Renders section that shows the phone number and conference ID
     * and give user the ability to copy them to the clipboard.
     *
     * @returns {ReactNode}
     */
    return (react_1.default.createElement("div", { className: 'dial-in-number' },
        react_1.default.createElement("p", null,
            react_1.default.createElement("span", { className: 'phone-number' },
                react_1.default.createElement("span", { className: 'info-label' }, t('info.dialInNumber')),
                react_1.default.createElement("span", { className: 'spacer' }, "\u00A0"),
                react_1.default.createElement("span", { className: 'info-value' }, phoneNumber)),
            react_1.default.createElement("br", null),
            react_1.default.createElement("span", { className: 'conference-id' },
                react_1.default.createElement("span", { className: 'info-label' }, t('info.dialInConferenceID')),
                react_1.default.createElement("span", { className: 'spacer' }, "\u00A0"),
                react_1.default.createElement("span", { className: 'info-value' }, `${(0, _utils_1._formatConferenceIDPin)(conferenceID)}#`))),
        react_1.default.createElement(Tooltip_1.default, { content: t('info.copyNumber'), position: 'top' },
            react_1.default.createElement("button", { "aria-label": t('info.copyNumber'), className: 'dial-in-copy invisible-button', 
                // eslint-disable-next-line react/jsx-no-bind
                onClick: _onCopyText, 
                // eslint-disable-next-line react/jsx-no-bind
                onKeyPress: _onCopyTextKeyPress },
                react_1.default.createElement(Icon_1.default, { src: isClicked ? svg_1.IconCheck : svg_1.IconCopy })))));
}
exports.default = (0, functions_1.translate)(DialInNumber);
