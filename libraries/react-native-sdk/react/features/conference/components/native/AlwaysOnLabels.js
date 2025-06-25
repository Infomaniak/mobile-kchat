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
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const actions_native_1 = require("../../../recording/actions.native");
const HighlightButton_1 = __importDefault(require("../../../recording/components/Recording/native/HighlightButton"));
const RecordingLabel_1 = __importDefault(require("../../../recording/components/native/RecordingLabel"));
const functions_1 = require("../../../recording/functions");
const VisitorsCountLabel_1 = __importDefault(require("../../../visitors/components/native/VisitorsCountLabel"));
const RaisedHandsCountLabel_1 = __importDefault(require("./RaisedHandsCountLabel"));
const constants_1 = require("./constants");
const AlwaysOnLabels = ({ createOnPress }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const isStreaming = (0, react_redux_1.useSelector)((state) => Boolean((0, functions_1.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM)));
    const openHighlightDialogCallback = (0, react_1.useCallback)(() => dispatch((0, actions_native_1.openHighlightDialog)()), [dispatch]);
    return (<>
        <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={createOnPress(constants_1.LABEL_ID_RECORDING)}>
            <RecordingLabel_1.default mode={lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE}/>
        </react_native_1.TouchableOpacity>
        {isStreaming
            && <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={createOnPress(constants_1.LABEL_ID_STREAMING)}>
                <RecordingLabel_1.default mode={lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM}/>
            </react_native_1.TouchableOpacity>}
        <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={openHighlightDialogCallback}>
            <HighlightButton_1.default />
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={createOnPress(constants_1.LABEL_ID_RAISED_HANDS_COUNT)}>
            <RaisedHandsCountLabel_1.default />
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity hitSlop={constants_1.LabelHitSlop} onPress={createOnPress(constants_1.LABEL_ID_VISITORS_COUNT)}>
            <VisitorsCountLabel_1.default />
        </react_native_1.TouchableOpacity>
    </>);
};
exports.default = AlwaysOnLabels;
