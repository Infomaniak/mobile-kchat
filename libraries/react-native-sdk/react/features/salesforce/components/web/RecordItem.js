"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordItem = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const constants_1 = require("../../constants");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        recordItem: {
            display: 'flex',
            alignItems: 'center'
        },
        recordTypeIcon: {
            borderRadius: theme.shape.borderRadius,
            height: '40px',
            marginRight: '16px',
            width: '40px'
        },
        recordDetails: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            overflow: 'hidden',
            padding: '12px 0',
            textOverflow: 'ellipsis'
        },
        recordName: {
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: '20px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        recordType: {
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '18px'
        }
    };
});
/**
 * Component to render Record data.
 *
 * @param {IProps} props - The props of the component.
 * @returns {React$Element<any>}
 */
const RecordItem = ({ id, name, 
// eslint-disable-next-line @typescript-eslint/no-empty-function
onClick = () => { }, type }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const Icon = constants_1.RECORD_TYPE[type].icon;
    const { classes } = useStyles();
    return (react_1.default.createElement("li", { className: classes.recordItem, key: `record-${id}`, onClick: onClick, title: name },
        react_1.default.createElement("div", { className: classes.recordTypeIcon }, Icon && react_1.default.createElement(Icon, null)),
        react_1.default.createElement("div", { className: classes.recordDetails },
            react_1.default.createElement("div", { className: classes.recordName, key: name }, name),
            react_1.default.createElement("div", { className: classes.recordType, key: type }, t(constants_1.RECORD_TYPE[type ?? ''].label)))));
};
exports.RecordItem = RecordItem;
