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
exports.ContextMenuMore = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../av-moderation/actions");
const functions_1 = require("../../../av-moderation/functions");
const actions_2 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/participants/functions");
const MuteEveryonesVideoDialog_1 = __importDefault(require("../../../video-menu/components/native/MuteEveryonesVideoDialog"));
const styles_1 = __importDefault(require("./styles"));
const ContextMenuMore = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const muteAllVideo = (0, react_1.useCallback)(() => {
        dispatch((0, actions_2.openDialog)(MuteEveryonesVideoDialog_1.default));
        dispatch((0, actions_2.hideSheet)());
    }, [dispatch]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const isModerationSupported = (0, react_redux_1.useSelector)((state) => (0, functions_1.isSupported)()(state));
    const allModerators = (0, react_redux_1.useSelector)(functions_2.isEveryoneModerator);
    const participantCount = (0, react_redux_1.useSelector)(functions_2.getParticipantCount);
    const isAudioModerationEnabled = (0, react_redux_1.useSelector)((0, functions_1.isEnabled)(constants_1.MEDIA_TYPE.AUDIO));
    const isVideoModerationEnabled = (0, react_redux_1.useSelector)((0, functions_1.isEnabled)(constants_1.MEDIA_TYPE.VIDEO));
    const disableAudioModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestDisableAudioModeration)()), [dispatch]);
    const disableVideoModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestDisableVideoModeration)()), [dispatch]);
    const enableAudioModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestEnableAudioModeration)()), [dispatch]);
    const enableVideoModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestEnableVideoModeration)()), [dispatch]);
    return (<BottomSheet_1.default addScrollViewPadding={false} showSlidingView={true}>
            <react_native_1.TouchableOpacity onPress={muteAllVideo} style={styles_1.default.contextMenuItem}>
                <Icon_1.default size={24} src={svg_1.IconVideoOff}/>
                <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('participantsPane.actions.stopEveryonesVideo')}</react_native_paper_1.Text>
            </react_native_1.TouchableOpacity>
            {isModerationSupported && ((participantCount === 1 || !allModerators)) && <>
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_1.default.divider}/>
                <react_native_1.View style={styles_1.default.contextMenuItem}>
                    <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('participantsPane.actions.allow')}</react_native_paper_1.Text>
                </react_native_1.View>
                {isAudioModerationEnabled
                ? <react_native_1.TouchableOpacity onPress={disableAudioModeration} style={styles_1.default.contextMenuItem}>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemTextNoIcon}>
                            {t('participantsPane.actions.audioModeration')}
                        </react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>
                : <react_native_1.TouchableOpacity onPress={enableAudioModeration} style={styles_1.default.contextMenuItem}>
                        <Icon_1.default size={24} src={svg_1.IconCheck}/>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>
                            {t('participantsPane.actions.audioModeration')}
                        </react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>}
                {isVideoModerationEnabled
                ? <react_native_1.TouchableOpacity onPress={disableVideoModeration} style={styles_1.default.contextMenuItem}>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemTextNoIcon}>
                            {t('participantsPane.actions.videoModeration')}
                        </react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>
                : <react_native_1.TouchableOpacity onPress={enableVideoModeration} style={styles_1.default.contextMenuItem}>
                        <Icon_1.default size={24} src={svg_1.IconCheck}/>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>
                            {t('participantsPane.actions.videoModeration')}
                        </react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>}
            </>}
        </BottomSheet_1.default>);
};
exports.ContextMenuMore = ContextMenuMore;
