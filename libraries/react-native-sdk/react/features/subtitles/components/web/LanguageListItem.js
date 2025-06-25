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
const functions_1 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        itemContainer: {
            display: 'flex',
            color: theme.palette.text02,
            alignItems: 'center',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '5px 0',
            '&:hover': {
                backgroundColor: theme.palette.ui04
            }
        },
        iconWrapper: {
            margin: '4px 10px',
            width: '22px',
            height: '22px'
        },
        activeItemContainer: {
            fontWeight: 700
        }
    };
});
/**
 * Component that renders the language list item.
 *
 * @returns {React$Element<any>}
 */
const LanguageListItem = ({ t, lang, selected, onLanguageSelected }) => {
    const { classes: styles } = useStyles();
    const onLanguageSelectedWrapper = (0, react_1.useCallback)(() => onLanguageSelected(lang), [lang]);
    return (react_1.default.createElement("div", { className: `${styles.itemContainer} ${selected ? styles.activeItemContainer : ''}`, onClick: onLanguageSelectedWrapper },
        react_1.default.createElement("span", { className: styles.iconWrapper }, selected
            && react_1.default.createElement(Icon_1.default, { src: svg_1.IconCheck })),
        t(lang)));
};
exports.default = (0, functions_1.translate)(LanguageListItem);
