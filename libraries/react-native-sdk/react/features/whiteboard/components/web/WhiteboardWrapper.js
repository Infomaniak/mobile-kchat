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
const excalidraw_1 = require("@jitsi/excalidraw");
const i18next_1 = __importDefault(require("i18next"));
const react_1 = __importStar(require("react"));
const constants_1 = require("../../constants");
/**
 * Whiteboard wrapper for mobile.
 *
 * @returns {JSX.Element}
 */
const WhiteboardWrapper = ({ className, collabDetails, collabServerUrl, localParticipantName }) => {
    const excalidrawRef = (0, react_1.useRef)(null);
    const excalidrawAPIRef = (0, react_1.useRef)(null);
    const collabAPIRef = (0, react_1.useRef)(null);
    const getExcalidrawAPI = (0, react_1.useCallback)(excalidrawAPI => {
        if (excalidrawAPIRef.current) {
            return;
        }
        excalidrawAPIRef.current = excalidrawAPI;
    }, []);
    const getCollabAPI = (0, react_1.useCallback)(collabAPI => {
        if (collabAPIRef.current) {
            return;
        }
        collabAPIRef.current = collabAPI;
        collabAPIRef.current.setUsername(localParticipantName);
    }, [localParticipantName]);
    return (react_1.default.createElement("div", { className: className },
        react_1.default.createElement("div", { className: 'excalidraw-wrapper' },
            react_1.default.createElement(excalidraw_1.ExcalidrawApp, { collabDetails: collabDetails, collabServerUrl: collabServerUrl, detectScroll: true, excalidraw: {
                    isCollaborating: true,
                    langCode: i18next_1.default.language,
                    // @ts-ignore
                    ref: excalidrawRef,
                    theme: 'light',
                    UIOptions: constants_1.WHITEBOARD_UI_OPTIONS
                }, getCollabAPI: getCollabAPI, getExcalidrawAPI: getExcalidrawAPI }))));
};
exports.default = WhiteboardWrapper;
