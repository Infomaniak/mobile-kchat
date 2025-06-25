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
const mui_1 = require("tss-react/mui");
const Popover_web_1 = __importDefault(require("../../../../base/popover/components/Popover.web"));
const functions_web_1 = require("../../../../base/styles/functions.web");
const actions_web_1 = require("../../../actions.web");
const functions_1 = require("../../../functions");
const utils_1 = require("../../../utils");
const CountryDropdown_1 = __importDefault(require("./CountryDropdown"));
const CountrySelector_1 = __importDefault(require("./CountrySelector"));
const PREFIX_REG = /^(00)|\+/;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            border: 0,
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            backgroundColor: theme.palette.ui03
        },
        input: {
            padding: '0 4px',
            margin: 0,
            border: 0,
            background: 'transparent',
            color: theme.palette.text01,
            flexGrow: 1,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular)
        }
    };
});
const CountryPicker = (props) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const inputRef = (0, react_1.useRef)(null);
    const { classes } = useStyles();
    (0, react_1.useEffect)(() => {
        inputRef.current?.focus();
    }, []);
    const onChange = ({ target: { value: newValue } }) => {
        if (PREFIX_REG.test(newValue)) {
            const textWithDialCode = newValue.replace(PREFIX_REG, '');
            if (textWithDialCode.length >= 4) {
                const country = (0, utils_1.getCountryFromDialCodeText)(textWithDialCode);
                if (country) {
                    const rest = textWithDialCode.replace(country.dialCode, '');
                    props.setDialOutCountry(country);
                    props.setDialOutNumber(rest);
                    return;
                }
            }
        }
        props.setDialOutNumber(newValue);
    };
    const onCountrySelectorClick = () => {
        setIsOpen(open => !open);
    };
    const onDropdownClose = () => {
        setIsOpen(false);
    };
    const onEntryClick = (country) => {
        props.setDialOutCountry(country);
        onDropdownClose();
    };
    const onKeyPress = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            props.onSubmit();
        }
    };
    return (
    /* eslint-disable react/jsx-no-bind */
    react_1.default.createElement(Popover_web_1.default, { content: react_1.default.createElement(CountryDropdown_1.default, { onEntryClick: onEntryClick }), onPopoverClose: onDropdownClose, position: 'bottom', trigger: 'click', visible: isOpen },
        react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement(CountrySelector_1.default, { country: props.dialOutCountry, onClick: onCountrySelectorClick }),
            react_1.default.createElement("input", { className: classes.input, onChange: onChange, onKeyPress: onKeyPress, ref: inputRef, value: props.dialOutNumber }))));
};
/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    return {
        dialOutCountry: (0, functions_1.getDialOutCountry)(state),
        dialOutNumber: (0, functions_1.getDialOutNumber)(state)
    };
}
/**
 * Maps redux actions to the props of the component.
 *
 * @type {{
 *     setDialOutCountry: Function,
 *     setDialOutNumber: Function
 * }}
 */
const mapDispatchToProps = {
    setDialOutCountry: actions_web_1.setDialOutCountry,
    setDialOutNumber: actions_web_1.setDialOutNumber
};
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(CountryPicker);
