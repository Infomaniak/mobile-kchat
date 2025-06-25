"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AlertDialog_1 = __importDefault(require("../../../base/dialog/components/native/AlertDialog"));
/**
 * Dialog to inform the user that we couldn't load the whiteboard.
 *
 * @returns {JSX.Element}
 */
const WhiteboardErrorDialog = () => (<AlertDialog_1.default contentKey='info.whiteboardError'/>);
exports.default = WhiteboardErrorDialog;
