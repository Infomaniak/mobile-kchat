"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const LogoutDialog = ({ onLogout }) => (<ConfirmDialog_1.default cancelLabel='dialog.Cancel' confirmLabel='dialog.Yes' descriptionKey='dialog.logoutQuestion' onSubmit={onLogout}/>);
exports.default = LogoutDialog;
