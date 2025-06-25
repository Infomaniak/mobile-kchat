"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const LanguageListItem_1 = __importDefault(require("./LanguageListItem"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
const LanguageList = ({ items, onLanguageSelected }) => {
    const listItems = items?.map(item => (<LanguageListItem_1.default key={item.id} lang={item.lang} onLanguageSelected={onLanguageSelected} selected={item.selected}/>));
    return (<react_native_1.ScrollView bounces={false} style={styles_1.default.itemsContainer}>
            {listItems}
        </react_native_1.ScrollView>);
};
exports.default = LanguageList;
