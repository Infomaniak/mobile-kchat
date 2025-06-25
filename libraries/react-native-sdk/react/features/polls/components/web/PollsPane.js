"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const AbstractPollsPane_1 = __importDefault(require("../AbstractPollsPane"));
const PollCreate_1 = __importDefault(require("./PollCreate"));
const PollsList_1 = __importDefault(require("./PollsList"));
/* eslint-enable lines-around-comment */
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        container: {
            height: '100%',
            position: 'relative'
        },
        listContainer: {
            height: 'calc(100% - 88px)',
            overflowY: 'auto'
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            padding: '24px',
            width: '100%',
            boxSizing: 'border-box'
        }
    };
});
const PollsPane = ({ createMode, onCreate, setCreateMode, t }) => {
    const { classes } = useStyles();
    return createMode
        ? react_1.default.createElement(PollCreate_1.default, { setCreateMode: setCreateMode })
        : react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement("div", { className: classes.listContainer },
                react_1.default.createElement(PollsList_1.default, { setCreateMode: setCreateMode })),
            react_1.default.createElement("div", { className: classes.footer },
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.create.create'), fullWidth: true, labelKey: 'polls.create.create', onClick: onCreate })));
};
/*
 * We apply AbstractPollsPane to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollsPane_1.default)(PollsPane);
