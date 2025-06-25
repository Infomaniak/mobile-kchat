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
const clsx_1 = __importDefault(require("clsx"));
const i18next_1 = __importDefault(require("i18next"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
// @ts-expect-error
const Filmstrip_1 = __importDefault(require("../../../../../modules/UI/videolayout/Filmstrip"));
const functions_1 = require("../../../base/i18n/functions");
const functions_2 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../filmstrip/functions.web");
const functions_web_2 = require("../../../toolbox/functions.web");
const functions_any_1 = require("../../../video-layout/functions.any");
const constants_1 = require("../../constants");
const functions_3 = require("../../functions");
/**
 * Space taken by meeting elements like the subject and the watermark.
 */
const HEIGHT_OFFSET = 80;
/**
 * The Whiteboard component.
 *
 * @param {Props} props - The React props passed to this component.
 * @returns {JSX.Element} - The React component.
 */
const Whiteboard = (props) => {
    const excalidrawRef = (0, react_1.useRef)(null);
    const excalidrawAPIRef = (0, react_1.useRef)(null);
    const collabAPIRef = (0, react_1.useRef)(null);
    const isOpen = (0, react_redux_1.useSelector)(functions_3.isWhiteboardOpen);
    const isVisible = (0, react_redux_1.useSelector)(functions_3.isWhiteboardVisible);
    const isInTileView = (0, react_redux_1.useSelector)(functions_any_1.shouldDisplayTileView);
    const { clientHeight, clientWidth } = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui']);
    const { visible: filmstripVisible, isResizing } = (0, react_redux_1.useSelector)((state) => state['features/filmstrip']);
    const filmstripWidth = (0, react_redux_1.useSelector)(functions_web_1.getVerticalViewMaxWidth);
    const collabDetails = (0, react_redux_1.useSelector)(functions_3.getCollabDetails);
    const collabServerUrl = (0, react_redux_1.useSelector)(functions_3.getCollabServerUrl);
    const { defaultRemoteDisplayName } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const localParticipantName = (0, react_redux_1.useSelector)(functions_2.getLocalParticipant)?.name || defaultRemoteDisplayName || 'Fellow Jitster';
    (0, react_1.useEffect)(() => {
        if (!collabAPIRef.current) {
            return;
        }
        collabAPIRef.current.setUsername(localParticipantName);
    }, [localParticipantName]);
    /**
    * Computes the width and the height of the component.
    *
    * @returns {IDimensions} - The dimensions of the component.
    */
    const getDimensions = () => {
        let width;
        let height;
        if (interfaceConfig.VERTICAL_FILMSTRIP) {
            if (filmstripVisible) {
                width = clientWidth - filmstripWidth;
            }
            else {
                width = clientWidth;
            }
            height = clientHeight - (0, functions_web_2.getToolboxHeight)();
        }
        else {
            if (filmstripVisible) {
                height = clientHeight - Filmstrip_1.default.getFilmstripHeight();
            }
            else {
                height = clientHeight;
            }
            width = clientWidth;
        }
        return {
            width: `${width}px`,
            height: `${height - HEIGHT_OFFSET}px`
        };
    };
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
    return (react_1.default.createElement("div", { className: (0, clsx_1.default)(isResizing && 'disable-pointer', 'whiteboard-container'), style: {
            ...getDimensions(),
            marginTop: `${HEIGHT_OFFSET}px`,
            display: `${isInTileView || !isVisible ? 'none' : 'block'}`
        } }, isOpen && (react_1.default.createElement("div", { className: 'excalidraw-wrapper' },
        react_1.default.createElement("span", { "aria-level": 1, className: 'sr-only', role: 'heading' }, props.t('whiteboard.accessibilityLabel.heading')),
        react_1.default.createElement(excalidraw_1.ExcalidrawApp, { collabDetails: collabDetails, collabServerUrl: collabServerUrl, excalidraw: {
                isCollaborating: true,
                langCode: i18next_1.default.language,
                // @ts-ignore
                ref: excalidrawRef,
                theme: 'light',
                UIOptions: constants_1.WHITEBOARD_UI_OPTIONS
            }, getCollabAPI: getCollabAPI, getExcalidrawAPI: getExcalidrawAPI })))));
};
exports.default = (0, functions_1.translate)(Whiteboard);
