"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStateToProps = void 0;
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const AbstractClosedCaptionButton_1 = require("../AbstractClosedCaptionButton");
/**
 * A button which starts/stops the transcriptions.
 */
class ClosedCaptionButton extends AbstractClosedCaptionButton_1.AbstractClosedCaptionButton {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.cc';
        this.icon = svg_1.IconSubtitles;
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
        (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.subtitles);
    }
}
/**
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state, ownProps) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.CLOSE_CAPTIONS_ENABLED, true);
    const abstractProps = (0, AbstractClosedCaptionButton_1._abstractMapStateToProps)(state, ownProps);
    return {
        ...abstractProps,
        visible: abstractProps.visible && enabled
    };
}
exports.mapStateToProps = mapStateToProps;
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(ClosedCaptionButton));
