"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../../base/styles/functions.web");
const functions_1 = require("../../../functions");
const DialInNumber_1 = __importDefault(require("./DialInNumber"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            '& .info-label': {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongBold)
            }
        },
        link: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegular),
            color: theme.palette.link01,
            '&:hover': {
                color: theme.palette.link01Hover
            }
        }
    };
});
/**
 * Returns a ReactElement for showing how to dial into the conference, if
 * dialing in is available.
 *
 * @private
 * @returns {null|ReactElement}
 */
function DialInSection({ phoneNumber }) {
    const { classes, cx } = useStyles();
    const conferenceID = (0, react_redux_1.useSelector)((state) => state['features/invite'].conferenceID);
    const dialInfoPageUrl = (0, react_redux_1.useSelector)(functions_1.getDialInfoPageURL);
    const showMoreNumbers = (0, react_redux_1.useSelector)((state) => (0, functions_1.hasMultipleNumbers)(state['features/invite'].numbers));
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement("div", { className: classes.container },
        react_1.default.createElement(DialInNumber_1.default, { conferenceID: conferenceID ?? '', phoneNumber: phoneNumber }),
        showMoreNumbers ? react_1.default.createElement("a", { className: cx('more-numbers', classes.link), href: dialInfoPageUrl, rel: 'noopener noreferrer', target: '_blank' }, t('info.moreNumbers')) : null));
}
exports.default = DialInSection;
