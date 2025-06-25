"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/conference/functions");
const constants_1 = require("../../../base/flags/constants");
const functions_2 = require("../../../base/flags/functions");
const AudioDeviceToggleButton_1 = __importDefault(require("../../../mobile/audio-mode/components/AudioDeviceToggleButton"));
const PictureInPictureButton_1 = __importDefault(require("../../../mobile/picture-in-picture/components/PictureInPictureButton"));
const ParticipantsPaneButton_1 = __importDefault(require("../../../participants-pane/components/native/ParticipantsPaneButton"));
const functions_3 = require("../../../participants-pane/functions");
const functions_4 = require("../../../prejoin/functions");
const ToggleCameraButton_1 = __importDefault(require("../../../toolbox/components/native/ToggleCameraButton"));
const functions_native_1 = require("../../../toolbox/functions.native");
const ConferenceTimer_1 = __importDefault(require("../ConferenceTimer"));
const Labels_1 = __importDefault(require("./Labels"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a navigation bar component that is rendered on top of the
 * conference screen.
 *
 * @param {IProps} props - The React props passed to this component.
 * @returns {JSX.Element}
 */
const TitleBar = (props) => {
    const { _isParticipantsPaneEnabled, _visible } = props;
    if (!_visible) {
        return null;
    }
    return (<react_native_1.View style={styles_1.default.titleBarWrapper}>
            <react_native_1.View style={styles_1.default.pipButtonContainer}>
                <PictureInPictureButton_1.default styles={styles_1.default.pipButton}/>
            </react_native_1.View>
            <react_native_1.View pointerEvents='box-none' style={styles_1.default.roomNameWrapper}>
                {props._conferenceTimerEnabled
            && <react_native_1.View style={styles_1.default.roomTimerView}>
                        <ConferenceTimer_1.default textStyle={styles_1.default.roomTimer}/>
                    </react_native_1.View>}
                {props._roomNameEnabled
            && <react_native_1.View style={styles_1.default.roomNameView}>
                        <react_native_1.Text numberOfLines={1} style={styles_1.default.roomName}>
                            {props._meetingName}
                        </react_native_1.Text>
                    </react_native_1.View>}
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <Labels_1.default createOnPress={props._createOnPress}/>
            </react_native_1.View>
            <react_native_1.View style={styles_1.default.titleBarButtonContainer}>
                <ToggleCameraButton_1.default styles={styles_1.default.titleBarButton}/>
            </react_native_1.View>
            <react_native_1.View style={styles_1.default.titleBarButtonContainer}>
                <AudioDeviceToggleButton_1.default styles={styles_1.default.titleBarButton}/>
            </react_native_1.View>
            {_isParticipantsPaneEnabled
            && <react_native_1.View style={styles_1.default.titleBarButtonContainer}>
                    <ParticipantsPaneButton_1.default styles={styles_1.default.titleBarButton}/>
                </react_native_1.View>}
        </react_native_1.View>);
};
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { hideConferenceTimer } = state['features/base/config'];
    const startTimestamp = (0, functions_1.getConferenceTimestamp)(state);
    return {
        _conferenceTimerEnabled: Boolean((0, functions_2.getFeatureFlag)(state, constants_1.CONFERENCE_TIMER_ENABLED, true) && !hideConferenceTimer && startTimestamp),
        _isParticipantsPaneEnabled: (0, functions_3.isParticipantsPaneEnabled)(state),
        _meetingName: (0, functions_1.getConferenceName)(state),
        _roomNameEnabled: (0, functions_4.isRoomNameEnabled)(state),
        _visible: (0, functions_native_1.isToolboxVisible)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(TitleBar);
