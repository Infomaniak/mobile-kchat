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
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const actions_1 = require("../../../visitors/actions");
/**
 * Dialog to confirm a remote participant demote to visitor action.
 *
 * @returns {JSX.Element}
 */
function DemoteToVisitorDialog({ participantID }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const handleSubmit = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.demoteRequest)(participantID));
        return true; // close dialog
    }, [dispatch, participantID]);
    return (<ConfirmDialog_1.default cancelLabel='dialog.Cancel' confirmLabel='dialog.confirm' descriptionKey='dialog.demoteParticipantDialog' isConfirmDestructive={true} onSubmit={handleSubmit} title='dialog.demoteParticipantTitle'/>);
}
exports.default = DemoteToVisitorDialog;
