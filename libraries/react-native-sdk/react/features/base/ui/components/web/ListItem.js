"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const constants_1 = require("../../../../participants-pane/constants");
const participantsPaneTheme_json_1 = __importDefault(require("../../../components/themes/participantsPaneTheme.json"));
const utils_1 = require("../../../environment/utils");
const functions_web_1 = require("../../../styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            alignItems: 'center',
            color: theme.palette.text01,
            display: 'flex',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            margin: `0 -${participantsPaneTheme_json_1.default.panePadding}px`,
            padding: `${theme.spacing(2)} ${participantsPaneTheme_json_1.default.panePadding}px`,
            position: 'relative',
            boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.15)',
            minHeight: '40px',
            '&:hover, &:focus-within': {
                backgroundColor: theme.palette.ui02,
                '& .indicators': {
                    display: 'none'
                },
                '& .actions': {
                    display: 'flex',
                    position: 'relative',
                    top: 'auto',
                    boxShadow: `-15px 0px 10px -5px ${theme.palette.ui02}`,
                    backgroundColor: theme.palette.ui02
                }
            },
            [`@media(max-width: ${participantsPaneTheme_json_1.default.MD_BREAKPOINT})`]: {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBoldLarge),
                padding: `${theme.spacing(3)} ${participantsPaneTheme_json_1.default.panePadding}px`
            }
        },
        highlighted: {
            backgroundColor: theme.palette.ui02,
            '& .actions': {
                display: 'flex',
                position: 'relative',
                top: 'auto',
                boxShadow: `-15px 0px 10px -5px ${theme.palette.ui02}`,
                backgroundColor: theme.palette.ui02
            }
        },
        detailsContainer: {
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
        },
        name: {
            display: 'flex',
            flex: 1,
            marginRight: theme.spacing(2),
            overflow: 'hidden',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        },
        indicators: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& > *': {
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
            },
            '& > *:not(:last-child)': {
                marginRight: theme.spacing(2)
            },
            '& .jitsi-icon': {
                padding: '3px'
            }
        },
        indicatorsHidden: {
            display: 'none'
        },
        actionsContainer: {
            position: 'absolute',
            top: '-1000px',
            boxShadow: `-15px 0px 10px -5px ${theme.palette.ui02}`,
            backgroundColor: theme.palette.ui02
        },
        actionsPermanent: {
            display: 'flex',
            boxShadow: `-15px 0px 10px -5px ${theme.palette.ui01}`,
            backgroundColor: theme.palette.ui01
        },
        actionsVisible: {
            display: 'flex',
            boxShadow: `-15px 0px 10px -5px ${theme.palette.ui02}`,
            backgroundColor: theme.palette.ui02
        }
    };
});
const ListItem = ({ actions, className, defaultName, icon, id, hideActions = false, indicators, isHighlighted, onClick, onLongPress, onMouseLeave, testId, textChildren, trigger }) => {
    const { classes, cx } = useStyles();
    const isMobile = (0, utils_1.isMobileBrowser)();
    let timeoutHandler;
    /**
     * Set calling long press handler after x milliseconds.
     *
     * @param {TouchEvent} e - Touch start event.
     * @returns {void}
     */
    function _onTouchStart(e) {
        const target = e.touches[0].target;
        timeoutHandler = window.setTimeout(() => onLongPress?.(target), 600);
    }
    /**
     * Cancel calling on long press after x milliseconds if the number of milliseconds is not reached
     * before a touch move(drag), or just clears the timeout.
     *
     * @returns {void}
     */
    function _onTouchMove() {
        clearTimeout(timeoutHandler);
    }
    /**
     * Cancel calling on long press after x milliseconds if the number of milliseconds is not reached yet,
     * or just clears the timeout.
     *
     * @returns {void}
     */
    function _onTouchEnd() {
        clearTimeout(timeoutHandler);
    }
    return (react_1.default.createElement("div", { "aria-label": defaultName, className: cx('list-item-container', classes.container, isHighlighted && classes.highlighted, className), "data-testid": testId, id: id, onClick: onClick, role: 'listitem', ...(isMobile
            ? {
                onTouchEnd: _onTouchEnd,
                onTouchMove: _onTouchMove,
                onTouchStart: _onTouchStart
            }
            : {
                onMouseLeave
            }) },
        react_1.default.createElement("div", null,
            " ",
            icon,
            " "),
        react_1.default.createElement("div", { className: classes.detailsContainer },
            react_1.default.createElement("div", { className: classes.name }, textChildren),
            indicators && (react_1.default.createElement("div", { className: cx('indicators', classes.indicators, (isHighlighted || trigger === constants_1.ACTION_TRIGGER.PERMANENT) && classes.indicatorsHidden) }, indicators)),
            !hideActions && (react_1.default.createElement("div", { className: cx('actions', classes.actionsContainer, trigger === constants_1.ACTION_TRIGGER.PERMANENT && classes.actionsPermanent, isHighlighted && classes.actionsVisible) }, actions)))));
};
exports.default = ListItem;
