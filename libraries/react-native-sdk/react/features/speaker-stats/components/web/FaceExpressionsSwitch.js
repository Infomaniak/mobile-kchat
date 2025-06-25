"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/styles/functions.web");
const Switch_1 = __importDefault(require("../../../base/ui/components/web/Switch"));
const useStyles = (0, mui_1.makeStyles)()((theme) => {
    return {
        switchContainer: {
            display: 'flex',
            alignItems: 'center'
        },
        switchLabel: {
            marginRight: 10,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular)
        }
    };
});
/**
 * React component for toggling face expressions grid.
 *
 * @returns {React$Element<any>}
 */
function FaceExpressionsSwitch({ onChange, showFaceExpressions }) {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement("div", { className: classes.switchContainer },
        react_1.default.createElement("label", { className: classes.switchLabel, htmlFor: 'face-expressions-switch' }, t('speakerStats.displayEmotions')),
        react_1.default.createElement(Switch_1.default, { checked: showFaceExpressions, id: 'face-expressions-switch', onChange: onChange })));
}
exports.default = FaceExpressionsSwitch;
