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
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../base/participants/functions");
const actions_1 = require("../../../base/settings/actions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Tooltip_1 = __importDefault(require("../../../base/tooltip/components/Tooltip"));
const functions_web_2 = require("../../../filmstrip/functions.web");
const functions_2 = require("../../functions");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        displayName: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            color: theme.palette.text01,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        editDisplayName: {
            outline: 'none',
            border: 'none',
            background: 'none',
            boxShadow: 'none',
            padding: 0,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            color: theme.palette.text01
        }
    };
});
const DisplayName = ({ allowEditing, displayNameSuffix, elementID, participantID, thumbnailType }) => {
    const { classes } = useStyles();
    const configuredDisplayName = (0, react_redux_1.useSelector)((state) => (0, functions_1.getParticipantById)(state, participantID))?.name ?? '';
    const nameToDisplay = (0, react_redux_1.useSelector)((state) => (0, functions_1.getParticipantDisplayName)(state, participantID));
    const [editDisplayNameValue, setEditDisplayNameValue] = (0, react_1.useState)('');
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const nameInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (isEditing && nameInputRef.current) {
            nameInputRef.current.select();
        }
    }, [isEditing]);
    const onClick = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
    }, []);
    const onChange = (0, react_1.useCallback)((event) => {
        setEditDisplayNameValue(event.target.value);
    }, []);
    const onSubmit = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.updateSettings)({
            displayName: editDisplayNameValue
        }));
        setEditDisplayNameValue('');
        setIsEditing(false);
        nameInputRef.current = null;
    }, [editDisplayNameValue, nameInputRef]);
    const onKeyDown = (0, react_1.useCallback)((event) => {
        if (event.key === 'Enter') {
            onSubmit();
        }
    }, [onSubmit]);
    const onStartEditing = (0, react_1.useCallback)((e) => {
        if (allowEditing) {
            e.stopPropagation();
            setIsEditing(true);
            setEditDisplayNameValue(configuredDisplayName);
        }
    }, [allowEditing]);
    if (allowEditing && isEditing) {
        return (react_1.default.createElement("input", { autoFocus: true, className: classes.editDisplayName, id: 'editDisplayName', onBlur: onSubmit, onChange: onChange, onClick: onClick, onKeyDown: onKeyDown, placeholder: t('defaultNickname'), ref: nameInputRef, spellCheck: 'false', type: 'text', value: editDisplayNameValue }));
    }
    return (react_1.default.createElement(Tooltip_1.default, { content: (0, functions_2.appendSuffix)(nameToDisplay, displayNameSuffix), position: (0, functions_web_2.getIndicatorsTooltipPosition)(thumbnailType) },
        react_1.default.createElement("span", { className: `displayname ${classes.displayName}`, id: elementID, onClick: onStartEditing }, (0, functions_2.appendSuffix)(nameToDisplay, displayNameSuffix))));
};
exports.default = DisplayName;
