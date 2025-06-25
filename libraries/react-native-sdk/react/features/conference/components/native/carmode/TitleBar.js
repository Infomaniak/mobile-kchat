"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/conference/functions");
const lib_jitsi_meet_1 = require("../../../../base/lib-jitsi-meet");
const functions_2 = require("../../../../base/participants/functions");
const ConnectionIndicator_1 = __importDefault(require("../../../../connection-indicator/components/native/ConnectionIndicator"));
const functions_3 = require("../../../../prejoin/functions");
const RecordingLabel_1 = __importDefault(require("../../../../recording/components/native/RecordingLabel"));
const VideoQualityLabel_native_1 = __importDefault(require("../../../../video-quality/components/VideoQualityLabel.native"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a navigation bar component that is rendered on top of the
 * carmode screen.
 *
 * @param {IProps} props - The React props passed to this component.
 * @returns {JSX.Element}
 */
const TitleBar = (props) => {
    const localParticipant = (0, react_redux_1.useSelector)(functions_2.getLocalParticipant);
    const localParticipantId = localParticipant?.id;
    return (<react_native_1.View style={styles_1.default.titleBarWrapper}>
            <react_native_1.View pointerEvents='box-none' style={styles_1.default.roomNameWrapper}>
                <react_native_1.View style={styles_1.default.qualityLabelContainer}>
                    <VideoQualityLabel_native_1.default />
                </react_native_1.View>
                <ConnectionIndicator_1.default iconStyle={styles_1.default.connectionIndicatorIcon} participantId={localParticipantId}/>
                <react_native_1.View style={styles_1.default.headerLabels}>
                    <RecordingLabel_1.default mode={lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE}/>
                    <RecordingLabel_1.default mode={lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM}/>
                </react_native_1.View>
                {props._meetingNameEnabled
            && <react_native_1.View style={styles_1.default.roomNameView}>
                        <react_native_1.Text numberOfLines={1} style={styles_1.default.roomName}>
                            {props._meetingName}
                        </react_native_1.Text>
                    </react_native_1.View>}
            </react_native_1.View>
        </react_native_1.View>);
};
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _meetingName: (0, functions_1.getConferenceName)(state),
        _meetingNameEnabled: (0, functions_3.isRoomNameEnabled)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(TitleBar);
