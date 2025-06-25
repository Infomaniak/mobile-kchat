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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const utils_1 = require("../../base/environment/utils");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const functions_web_1 = require("../../base/styles/functions.web");
const Dialog_1 = __importDefault(require("../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../base/ui/components/web/Input"));
const actions_web_1 = require("../actions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        dialog: {
            marginBottom: theme.spacing(1)
        },
        rating: {
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(3)
        },
        ratingLabel: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            color: theme.palette.text01,
            marginBottom: theme.spacing(2),
            height: '20px'
        },
        stars: {
            display: 'flex'
        },
        starBtn: {
            display: 'inline-block',
            cursor: 'pointer',
            marginRight: theme.spacing(3),
            '&:last-of-type': {
                marginRight: 0
            },
            '&.active svg': {
                fill: theme.palette.success01
            },
            '&:focus': {
                outline: `1px solid ${theme.palette.action01}`,
                borderRadius: '4px'
            }
        },
        title: {
            fontSize: '16px'
        },
        details: {
            '& textarea': {
                minHeight: '122px'
            }
        }
    };
});
/**
 * The scores to display for selecting. The score is the index in the array and
 * the value of the index is a translation key used for display in the dialog.
 */
const SCORES = [
    'feedback.veryBad',
    'feedback.bad',
    'feedback.average',
    'feedback.good',
    'feedback.veryGood'
];
const ICON_SIZE = 32;
/**
 * A React {@code Component} for displaying a dialog to rate the current
 * conference quality, write a message describing the experience, and submit
 * the feedback.
 *
 * @param {IProps} props - Component's props.
 * @returns {JSX}
 */
const FeedbackDialog = ({ conference, onClose, title }) => {
    const { classes } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _message = (0, react_redux_1.useSelector)((state) => state['features/feedback'].message);
    const _score = (0, react_redux_1.useSelector)((state) => state['features/feedback'].score);
    /**
     * The currently entered feedback message.
     */
    const [message, setMessage] = (0, react_1.useState)(_message);
    /**
     * The score selection index which is currently being hovered. The
     * value -1 is used as a sentinel value to match store behavior of
     * using -1 for no score having been selected.
     */
    const [mousedOverScore, setMousedOverScore] = (0, react_1.useState)(-1);
    /**
     * The currently selected score selection index. The score will not
     * be 0 indexed so subtract one to map with SCORES.
     */
    const [score, setScore] = (0, react_1.useState)(_score > -1 ? _score - 1 : _score);
    /**
     * An array of objects with click handlers for each of the scores listed in
     * the constant SCORES. This pattern is used for binding event handlers only
     * once for each score selection icon.
     */
    const scoreClickConfigurations = (0, react_1.useRef)(SCORES.map((textKey, index) => {
        return {
            _onClick: () => onScoreSelect(index),
            _onKeyDown: (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                    onScoreSelect(index);
                }
            },
            _onMouseOver: () => onScoreMouseOver(index)
        };
    }));
    (0, react_1.useEffect)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createFeedbackOpenEvent)());
        if (typeof APP !== 'undefined') {
            APP.API.notifyFeedbackPromptDisplayed();
        }
        return () => {
            onClose?.();
        };
    }, []);
    /**
     * Dispatches an action notifying feedback was not submitted. The submitted
     * score will have one added as the rest of the app does not expect 0
     * indexing.
     *
     * @private
     * @returns {boolean} Returns true to close the dialog.
     */
    const onCancel = (0, react_1.useCallback)(() => {
        const scoreToSubmit = score > -1 ? score + 1 : score;
        dispatch((0, actions_web_1.cancelFeedback)(scoreToSubmit, message));
        return true;
    }, [score, message]);
    /**
     * Updates the known entered feedback message.
     *
     * @param {string} newValue - The new value from updating the textfield for the
     * feedback message.
     * @private
     * @returns {void}
     */
    const onMessageChange = (0, react_1.useCallback)((newValue) => {
        setMessage(newValue);
    }, []);
    /**
     * Updates the currently selected score.
     *
     * @param {number} newScore - The index of the selected score in SCORES.
     * @private
     * @returns {void}
     */
    function onScoreSelect(newScore) {
        setScore(newScore);
    }
    /**
     * Sets the currently hovered score to null to indicate no hover is
     * occurring.
     *
     * @private
     * @returns {void}
     */
    const onScoreContainerMouseLeave = (0, react_1.useCallback)(() => {
        setMousedOverScore(-1);
    }, []);
    /**
     * Updates the known state of the score icon currently behind hovered over.
     *
     * @param {number} newMousedOverScore - The index of the SCORES value currently
     * being moused over.
     * @private
     * @returns {void}
     */
    function onScoreMouseOver(newMousedOverScore) {
        setMousedOverScore(newMousedOverScore);
    }
    /**
     * Dispatches the entered feedback for submission. The submitted score will
     * have one added as the rest of the app does not expect 0 indexing.
     *
     * @private
     * @returns {boolean} Returns true to close the dialog.
     */
    const _onSubmit = (0, react_1.useCallback)(() => {
        const scoreToSubmit = score > -1 ? score + 1 : score;
        dispatch((0, actions_web_1.submitFeedback)(scoreToSubmit, message, conference));
        return true;
    }, [score, message, conference]);
    const scoreToDisplayAsSelected = mousedOverScore > -1 ? mousedOverScore : score;
    const scoreIcons = scoreClickConfigurations.current.map((config, index) => {
        const isFilled = index <= scoreToDisplayAsSelected;
        const activeClass = isFilled ? 'active' : '';
        const className = `${classes.starBtn} ${activeClass}`;
        return (react_1.default.createElement("span", { "aria-label": t(SCORES[index]), className: className, key: index, onClick: config._onClick, onKeyDown: config._onKeyDown, role: 'button', tabIndex: 0, ...((0, utils_1.isMobileBrowser)() ? {} : {
                onMouseOver: config._onMouseOver
            }) }, isFilled
            ? react_1.default.createElement(Icon_1.default, { size: ICON_SIZE, src: svg_1.IconFavoriteSolid })
            : react_1.default.createElement(Icon_1.default, { size: ICON_SIZE, src: svg_1.IconFavorite })));
    });
    return (react_1.default.createElement(Dialog_1.default, { disableEnter: true, ok: {
            translationKey: 'dialog.Submit'
        }, onCancel: onCancel, onSubmit: _onSubmit, size: 'large', titleKey: 'feedback.rateExperience' },
        react_1.default.createElement("div", { className: classes.dialog },
            title ? react_1.default.createElement("div", { className: classes.title }, t(title)) : null,
            react_1.default.createElement("div", { className: classes.rating },
                react_1.default.createElement("div", { className: classes.stars, onMouseLeave: onScoreContainerMouseLeave }, scoreIcons),
                react_1.default.createElement("div", { className: classes.ratingLabel },
                    react_1.default.createElement("p", { className: 'sr-only' }, t('feedback.accessibilityLabel.yourChoice', {
                        rating: t(SCORES[scoreToDisplayAsSelected])
                    })),
                    react_1.default.createElement("p", { "aria-hidden": true, id: 'starLabel' }, t(SCORES[scoreToDisplayAsSelected])))),
            react_1.default.createElement("div", { className: classes.details },
                react_1.default.createElement(Input_1.default, { id: 'feedbackTextArea', label: t('feedback.detailsLabel'), onChange: onMessageChange, textarea: true, value: message })))));
};
exports.default = FeedbackDialog;
