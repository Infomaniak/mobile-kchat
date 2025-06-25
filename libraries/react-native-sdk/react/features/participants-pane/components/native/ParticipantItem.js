"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const constants_1 = require("../../constants");
const RaisedHandIndicator_1 = require("./RaisedHandIndicator");
const styles_1 = __importDefault(require("./styles"));
/**
 * Participant item.
 *
 * @returns {React$Element<any>}
 */
function ParticipantItem({ children, displayName, disableModeratorIndicator, isKnockingParticipant = false, isModerator, local, onPress, participantID, raisedHand, audioMediaState = constants_1.MEDIA_STATE.NONE, videoMediaState = constants_1.MEDIA_STATE.NONE }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const participantNameContainerStyles = isKnockingParticipant ? styles_1.default.lobbyParticipantNameContainer : styles_1.default.participantNameContainer;
    return (<react_native_1.View style={styles_1.default.participantContainer}>
            <react_native_1.TouchableOpacity onPress={onPress} style={styles_1.default.participantContent}>
                <Avatar_1.default displayName={displayName} participantId={participantID} size={32}/>
                <react_native_1.View style={[
            styles_1.default.participantDetailsContainer,
            raisedHand && styles_1.default.participantDetailsContainerRaisedHand
        ]}>
                    <react_native_1.View style={participantNameContainerStyles}>
                        <react_native_paper_1.Text numberOfLines={1} style={styles_1.default.participantName}>
                            {displayName}
                            {local && ` (${t('chat.you')})`}
                        </react_native_paper_1.Text>
                    </react_native_1.View>
                    {isModerator && !disableModeratorIndicator
            && <react_native_paper_1.Text style={styles_1.default.moderatorLabel}>
                            {t('videothumbnail.moderator')}
                        </react_native_paper_1.Text>}
                </react_native_1.View>
                {!isKnockingParticipant
            && <>
                        {raisedHand && <RaisedHandIndicator_1.RaisedHandIndicator />}
                        <react_native_1.View style={styles_1.default.participantStatesContainer}>
                            <react_native_1.View style={styles_1.default.participantStateVideo}>{constants_1.VideoStateIcons[videoMediaState]}</react_native_1.View>
                            <react_native_1.View>{constants_1.AudioStateIcons[audioMediaState]}</react_native_1.View>
                        </react_native_1.View>
                    </>}
            </react_native_1.TouchableOpacity>
            {!local && children}
        </react_native_1.View>);
}
exports.default = ParticipantItem;
