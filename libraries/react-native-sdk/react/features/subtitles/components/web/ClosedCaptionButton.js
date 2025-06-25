"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const actions_web_1 = require("../../actions.web");
const AbstractClosedCaptionButton_1 = require("../AbstractClosedCaptionButton");
/**
 * A button which starts/stops the transcriptions.
 */
class ClosedCaptionButton extends AbstractClosedCaptionButton_1.AbstractClosedCaptionButton {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.cc';
        this.icon = svg_1.IconSubtitles;
        this.tooltip = 'transcribing.ccButtonTooltip';
        this.label = 'toolbar.startSubtitles';
        this.labelProps = {
            language: this.props.t(this.props._language ?? 'transcribing.subtitlesOff'),
            languages: this.props.t(this.props.languages ?? ''),
            languagesHead: this.props.t(this.props.languagesHead ?? '')
        };
    }
    /**
     * Toggle language selection dialog.
     *
     * @returns {void}
     */
    _handleClickOpenLanguageSelector() {
        const { dispatch } = this.props;
        dispatch((0, actions_web_1.toggleLanguageSelectorDialog)());
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractClosedCaptionButton_1._abstractMapStateToProps)(ClosedCaptionButton));
