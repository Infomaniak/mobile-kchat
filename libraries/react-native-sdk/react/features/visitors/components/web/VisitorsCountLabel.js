"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../base/label/components/web/Label"));
const Tooltip_1 = __importDefault(require("../../../base/tooltip/components/Tooltip"));
const functions_1 = require("../../functions");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        label: {
            backgroundColor: theme.palette.warning02,
            color: theme.palette.uiBackground
        }
    };
});
const VisitorsCountLabel = () => {
    const { classes: styles, theme } = useStyles();
    const visitorsMode = (0, react_redux_1.useSelector)((state) => (0, functions_1.iAmVisitor)(state));
    const visitorsCount = (0, react_redux_1.useSelector)((state) => state['features/visitors'].count || 0);
    const { t } = (0, react_i18next_1.useTranslation)();
    return !visitorsMode && visitorsCount > 0 ? (react_1.default.createElement(Tooltip_1.default, { content: t('visitors.labelTooltip', { count: visitorsCount }), position: 'bottom' },
        react_1.default.createElement(Label_1.default, { className: styles.label, icon: svg_1.IconUsers, iconColor: theme.palette.icon04, id: 'visitorsCountLabel', text: `${(0, functions_1.getVisitorsShortText)(visitorsCount)}` }))) : null;
};
exports.default = VisitorsCountLabel;
