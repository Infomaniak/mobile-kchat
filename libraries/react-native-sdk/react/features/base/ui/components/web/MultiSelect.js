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
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../icons/svg");
const functions_web_1 = require("../../../styles/functions.web");
const ClickableIcon_1 = __importDefault(require("./ClickableIcon"));
const Input_1 = __importDefault(require("./Input"));
const MULTI_SELECT_HEIGHT = 200;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            position: 'relative'
        },
        items: {
            '&.found': {
                position: 'absolute',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.75)'
            },
            marginTop: theme.spacing(2),
            width: '100%',
            backgroundColor: theme.palette.ui01,
            border: `1px solid ${theme.palette.ui04}`,
            borderRadius: `${Number(theme.shape.borderRadius)}px`,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            zIndex: 2,
            maxHeight: `${MULTI_SELECT_HEIGHT}px`,
            overflowY: 'auto',
            padding: '0'
        },
        listItem: {
            boxSizing: 'border-box',
            display: 'flex',
            padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
            alignItems: 'center',
            '& .content': {
                // 38px because of the icon before the content
                inlineSize: 'calc(100% - 38px)',
                overflowWrap: 'break-word',
                marginLeft: theme.spacing(2),
                color: theme.palette.text01,
                '&.with-remove': {
                    // 60px because of the icon before the content and the remove button
                    inlineSize: 'calc(100% - 60px)',
                    marginRight: theme.spacing(2),
                    '&.without-before': {
                        marginLeft: 0,
                        inlineSize: 'calc(100% - 38px)'
                    }
                },
                '&.without-before': {
                    marginLeft: 0,
                    inlineSize: '100%'
                }
            },
            '&.found': {
                cursor: 'pointer',
                padding: `10px ${theme.spacing(3)}`,
                '&:hover': {
                    backgroundColor: theme.palette.ui02
                }
            },
            '&.disabled': {
                cursor: 'not-allowed',
                '&:hover': {
                    backgroundColor: theme.palette.ui01
                },
                color: theme.palette.text03
            }
        },
        errorMessage: {
            position: 'absolute',
            marginTop: theme.spacing(2),
            width: '100%'
        }
    };
});
const MultiSelect = ({ autoFocus, disabled, error, errorDialog, placeholder, id, items, filterValue, onFilterChange, isOpen, noMatchesText, onSelected, selectedItems, onRemoved }) => {
    const { classes } = useStyles();
    const inputRef = (0, react_1.useRef)();
    const selectItem = (0, react_1.useCallback)(item => () => onSelected(item), [onSelected]);
    const removeItem = (0, react_1.useCallback)(item => () => onRemoved(item), [onRemoved]);
    const foundItems = (0, react_1.useMemo)(() => (react_1.default.createElement("div", { className: `${classes.items} found` }, items.length > 0
        ? items.map(item => (react_1.default.createElement("div", { className: `${classes.listItem} ${item.isDisabled ? 'disabled' : ''} found`, key: item.value, onClick: item.isDisabled ? undefined : selectItem(item) },
            item.elemBefore,
            react_1.default.createElement("div", { className: `content ${item.elemBefore ? '' : 'without-before'}` },
                item.content,
                item.description && react_1.default.createElement("p", null, item.description)))))
        : react_1.default.createElement("div", { className: classes.listItem }, noMatchesText))), [items]);
    const errorMessageDialog = (0, react_1.useMemo)(() => error && react_1.default.createElement("div", { className: classes.errorMessage }, errorDialog), [error]);
    return (react_1.default.createElement("div", { className: classes.container },
        react_1.default.createElement(Input_1.default, { autoFocus: autoFocus, disabled: disabled, id: id, onChange: onFilterChange, placeholder: placeholder, ref: inputRef, value: filterValue ?? '' }),
        isOpen && foundItems,
        errorMessageDialog,
        selectedItems && selectedItems?.length > 0 && (react_1.default.createElement("div", { className: classes.items }, selectedItems.map(item => (react_1.default.createElement("div", { className: `${classes.listItem} ${item.isDisabled ? 'disabled' : ''}`, key: item.value },
            item.elemBefore,
            react_1.default.createElement("div", { className: `content with-remove ${item.elemBefore ? '' : 'without-before'}` },
                react_1.default.createElement("p", null, item.content)),
            react_1.default.createElement(ClickableIcon_1.default, { accessibilityLabel: 'multi-select-unselect', icon: svg_1.IconCloseLarge, id: 'modal-header-close-button', onClick: removeItem(item) }))))))));
};
exports.default = MultiSelect;
