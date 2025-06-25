"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../utils");
const CountryRow_1 = __importDefault(require("./CountryRow"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            height: '190px',
            width: '343px',
            overflowY: 'auto',
            backgroundColor: theme.palette.ui01
        }
    };
});
/**
 * This component displays the dropdown for the country picker.
 *
 * @returns {ReactElement}
 */
function CountryDropdown({ onEntryClick }) {
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.container }, utils_1.countries.map(country => (react_1.default.createElement(CountryRow_1.default, { country: country, key: `${country.code}`, onEntryClick: onEntryClick })))));
}
exports.default = CountryDropdown;
