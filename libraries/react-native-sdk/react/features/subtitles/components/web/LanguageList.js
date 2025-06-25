"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const LanguageListItem_1 = __importDefault(require("./LanguageListItem"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        itemsContainer: {
            display: 'flex',
            flexFlow: 'column'
        }
    };
});
/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
const LanguageList = ({ items, onLanguageSelected }) => {
    const { classes: styles } = useStyles();
    const listItems = items.map(item => (react_1.default.createElement(LanguageListItem_1.default, { key: item.id, lang: item.lang, onLanguageSelected: onLanguageSelected, selected: item.selected })));
    return (react_1.default.createElement("div", { className: styles.itemsContainer }, listItems));
};
exports.default = LanguageList;
