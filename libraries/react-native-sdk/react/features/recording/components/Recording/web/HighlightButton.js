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
exports.HighlightButton = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_1 = require("../../../../base/dialog/actions");
const functions_1 = require("../../../../base/i18n/functions");
const svg_1 = require("../../../../base/icons/svg");
const constants_1 = require("../../../../base/jwt/constants");
const Label_1 = __importDefault(require("../../../../base/label/components/web/Label"));
const Tooltip_1 = __importDefault(require("../../../../base/tooltip/components/Tooltip"));
const BaseTheme_web_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.web"));
const actions_2 = require("../../../../jaas/actions");
const StartRecordingDialog_1 = __importDefault(require("../../Recording/web/StartRecordingDialog"));
const AbstractHighlightButton_1 = __importStar(require("../AbstractHighlightButton"));
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
const styles = (theme) => {
    return {
        container: {
            position: 'relative'
        },
        disabled: {
            background: theme.palette.text02
        },
        regular: {
            background: theme.palette.ui10
        },
        highlightNotification: {
            backgroundColor: theme.palette.ui10,
            borderRadius: '6px',
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box',
            color: theme.palette.uiBackground,
            fontSize: '14px',
            fontWeight: 400,
            left: '4px',
            padding: '16px',
            position: 'absolute',
            top: '32px',
            width: 320
        },
        highlightNotificationButton: {
            color: theme.palette.action01,
            cursor: 'pointer',
            fontWeight: 600,
            marginTop: '8px'
        }
    };
};
/**
 * React {@code Component} responsible for displaying an action that
 * allows users to highlight a meeting moment.
 */
class HighlightButton extends AbstractHighlightButton_1.default {
    /**
     * Initializes a new HighlightButton instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            isNotificationOpen: false
        };
        this._onOpenDialog = this._onOpenDialog.bind(this);
        this._onWindowClickListener = this._onWindowClickListener.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        window.addEventListener('click', this._onWindowClickListener);
    }
    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        window.removeEventListener('click', this._onWindowClickListener);
    }
    /**
    * Handles clicking / pressing the start recording button.
    *
    * @returns {void}
    */
    async _onOpenDialog() {
        const { dispatch } = this.props;
        const dialogShown = await dispatch((0, actions_2.maybeShowPremiumFeatureDialog)(constants_1.MEET_FEATURES.RECORDING));
        if (!dialogShown) {
            dispatch((0, actions_1.openDialog)(StartRecordingDialog_1.default));
        }
    }
    /**
    * Handles clicking / pressing the highlight button.
    *
    * @override
    * @param {Event} e - The click event.
    * @returns {void}
    */
    _onClick(e) {
        e?.stopPropagation();
        const { _disabled } = this.props;
        if (_disabled) {
            this.setState({
                isNotificationOpen: true
            });
        }
        else {
            super._onClick();
        }
    }
    /**
     * Window click event listener.
     *
     * @returns {void}
     */
    _onWindowClickListener() {
        this.setState({
            isNotificationOpen: false
        });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _disabled, _visible, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        if (!_visible) {
            return null;
        }
        const className = _disabled ? classes.disabled : classes.regular;
        const tooltipKey = _disabled ? 'recording.highlightMomentDisabled' : 'recording.highlightMoment';
        return (react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement(Tooltip_1.default, { content: t(tooltipKey), position: 'bottom' },
                react_1.default.createElement(Label_1.default, { className: className, icon: svg_1.IconHighlight, iconColor: _disabled ? BaseTheme_web_1.default.palette.text03 : BaseTheme_web_1.default.palette.field01, id: 'highlightMeetingLabel', onClick: this._onClick })),
            this.state.isNotificationOpen && (react_1.default.createElement("div", { className: classes.highlightNotification },
                t('recording.highlightMomentDisabled'),
                react_1.default.createElement("div", { className: classes.highlightNotificationButton, onClick: this._onOpenDialog }, t('localRecording.start'))))));
    }
}
exports.HighlightButton = HighlightButton;
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)((0, react_redux_1.connect)(AbstractHighlightButton_1._abstractMapStateToProps)(HighlightButton)), styles);
