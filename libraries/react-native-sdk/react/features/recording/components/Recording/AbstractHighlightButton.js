"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._abstractMapStateToProps = void 0;
const react_1 = require("react");
const actions_1 = require("../../../base/dialog/actions");
const constants_1 = require("../../../base/jwt/constants");
const actions_2 = require("../../../jaas/actions");
const actions_3 = require("../../../notifications/actions");
const constants_2 = require("../../../notifications/constants");
const functions_1 = require("../../../visitors/functions");
const actions_any_1 = require("../../actions.any");
const constants_3 = require("../../constants");
const functions_2 = require("../../functions");
const index_1 = require("./index");
/**
 * Abstract class for the {@code AbstractHighlightButton} component.
 */
class AbstractHighlightButton extends react_1.Component {
    /**
     * Initializes a new AbstractHighlightButton instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
    }
    /**
   * Handles clicking / pressing the button.
   *
   * @override
   * @protected
   * @returns {void}
   */
    _onClick() {
        const { _disabled, _isHighlightInProgress, dispatch } = this.props;
        if (_isHighlightInProgress) {
            return;
        }
        if (_disabled) {
            dispatch((0, actions_3.showNotification)({
                descriptionKey: 'recording.highlightMomentDisabled',
                titleKey: 'recording.highlightMoment',
                uid: constants_3.PROMPT_RECORDING_NOTIFICATION_ID,
                customActionNameKey: ['localRecording.start'],
                customActionHandler: [async () => {
                        dispatch((0, actions_3.hideNotification)(constants_3.PROMPT_RECORDING_NOTIFICATION_ID));
                        const dialogShown = await dispatch((0, actions_2.maybeShowPremiumFeatureDialog)(constants_1.MEET_FEATURES.RECORDING));
                        if (!dialogShown) {
                            dispatch((0, actions_1.openDialog)(index_1.StartRecordingDialog));
                        }
                    }],
                appearance: constants_2.NOTIFICATION_TYPE.NORMAL
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }
        else {
            dispatch((0, actions_any_1.highlightMeetingMoment)());
        }
    }
}
exports.default = AbstractHighlightButton;
/**
 * Maps (parts of) the Redux state to the associated
 * {@code AbstractHighlightButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 *     _isHighlightInProgress: boolean,
 *     _visible: boolean
 * }}
 */
function _abstractMapStateToProps(state) {
    const isRecordingRunning = (0, functions_2.isCloudRecordingRunning)(state);
    const isButtonDisabled = (0, functions_2.isHighlightMeetingMomentDisabled)(state);
    const { webhookProxyUrl } = state['features/base/config'];
    const _iAmVisitor = (0, functions_1.iAmVisitor)(state);
    const { disabled: isRecordButtonDisabled, visible: isRecordButtonVisible } = (0, functions_2.getRecordButtonProps)(state);
    const canStartRecording = isRecordButtonVisible && !isRecordButtonDisabled;
    const _visible = Boolean((canStartRecording || isRecordingRunning) && Boolean(webhookProxyUrl) && !_iAmVisitor);
    return {
        _disabled: !isRecordingRunning,
        _isHighlightInProgress: isButtonDisabled,
        _visible
    };
}
exports._abstractMapStateToProps = _abstractMapStateToProps;
