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
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../../base/i18n/functions");
const functions_web_1 = require("../../../../base/styles/functions.web");
const Input_1 = __importDefault(require("../../../../base/ui/components/web/Input"));
const AbstractStreamKeyForm_1 = __importStar(require("../AbstractStreamKeyForm"));
const styles = (theme) => {
    return {
        helperLink: {
            cursor: 'pointer',
            color: theme.palette.link01,
            transition: 'color .2s ease',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            marginLeft: 'auto',
            marginTop: theme.spacing(1),
            '&:hover': {
                textDecoration: 'underline',
                color: theme.palette.link01Hover
            },
            '&:active': {
                color: theme.palette.link01Active
            }
        }
    };
};
/**
 * A React Component for entering a key for starting a YouTube live stream.
 *
 * @augments Component
 */
class StreamKeyForm extends AbstractStreamKeyForm_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t, value } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: 'stream-key-form' },
            react_1.default.createElement(Input_1.default, { autoFocus: true, id: 'streamkey-input', label: t('dialog.streamKey'), name: 'streamId', onChange: this._onInputChange, placeholder: t('liveStreaming.enterStreamKey'), type: 'text', value: value }),
            react_1.default.createElement("div", { className: 'form-footer' },
                react_1.default.createElement("div", { className: 'help-container' },
                    this.state.showValidationError
                        ? react_1.default.createElement("span", { className: 'warning-text' }, t('liveStreaming.invalidStreamKey'))
                        : null,
                    this.props._liveStreaming.helpURL
                        ? react_1.default.createElement("a", { className: classes.helperLink, href: this.props._liveStreaming.helpURL, rel: 'noopener noreferrer', target: '_blank' }, t('liveStreaming.streamIdHelp'))
                        : null),
                react_1.default.createElement("a", { className: classes.helperLink, href: this.props._liveStreaming.termsURL, rel: 'noopener noreferrer', target: '_blank' }, t('liveStreaming.youtubeTerms')),
                react_1.default.createElement("a", { className: classes.helperLink, href: this.props._liveStreaming.dataPrivacyURL, rel: 'noopener noreferrer', target: '_blank' }, t('liveStreaming.googlePrivacyPolicy')))));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractStreamKeyForm_1._mapStateToProps)((0, mui_1.withStyles)(StreamKeyForm, styles)));
