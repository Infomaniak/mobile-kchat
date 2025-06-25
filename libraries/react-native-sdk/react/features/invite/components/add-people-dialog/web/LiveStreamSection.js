"use strict";
/* eslint-disable react/jsx-no-bind */
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
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const copyText_web_1 = require("../../../../base/util/copyText.web");
/**
 * Section of the {@code AddPeopleDialog} that renders the
 * live streaming url, allowing a copy action.
 *
 * @returns {React$Element<any>}
 */
function LiveStreamSection({ liveStreamViewURL, t }) {
    const [isClicked, setIsClicked] = (0, react_1.useState)(false);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    /**
     * Click handler for the element.
     *
     * @returns {void}
     */
    async function onClick() {
        setIsHovered(false);
        const isCopied = await (0, copyText_web_1.copyText)(liveStreamViewURL);
        if (isCopied) {
            setIsClicked(true);
            setTimeout(() => {
                setIsClicked(false);
            }, 2500);
        }
    }
    /**
     * Hover handler for the element.
     *
     * @returns {void}
     */
    function onHoverIn() {
        if (!isClicked) {
            setIsHovered(true);
        }
    }
    /**
     * Hover handler for the element.
     *
     * @returns {void}
     */
    function onHoverOut() {
        setIsHovered(false);
    }
    /**
     * Renders the content of the link based on the state.
     *
     * @returns {React$Element<any>}
     */
    function renderLinkContent() {
        if (isClicked) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: 'invite-more-dialog stream-text selected' }, t('addPeople.linkCopied')),
                react_1.default.createElement(Icon_1.default, { src: svg_1.IconCheck })));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: 'invite-more-dialog stream-text' }, isHovered ? t('addPeople.copyStream') : liveStreamViewURL),
            react_1.default.createElement(Icon_1.default, { src: svg_1.IconCopy })));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", null, t('addPeople.shareStream')),
        react_1.default.createElement("div", { className: `invite-more-dialog stream${isClicked ? ' clicked' : ''}`, onClick: onClick, onMouseOut: onHoverOut, onMouseOver: onHoverIn }, renderLinkContent()),
        react_1.default.createElement("div", { className: 'invite-more-dialog separator' })));
}
exports.default = (0, functions_1.translate)(LiveStreamSection);
