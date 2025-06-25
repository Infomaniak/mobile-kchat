"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const StatelessAvatar_1 = __importDefault(require("../../../base/avatar/components/native/StatelessAvatar"));
const functions_1 = require("../../../base/avatar/functions");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const TimeElapsed_1 = __importDefault(require("./TimeElapsed"));
const styles_1 = __importDefault(require("./styles"));
const SpeakerStatsItem = (props) => (<react_native_1.View key={props.participantId} style={styles_1.default.speakerStatsItemContainer}>
            <react_native_1.View style={styles_1.default.speakerStatsAvatar}>
                {props.hasLeft ? (<StatelessAvatar_1.default color={BaseTheme_native_1.default.palette.ui05} initials={(0, functions_1.getInitials)(props.displayName)} size={BaseTheme_native_1.default.spacing[5]}/>) : (<Avatar_1.default className='userAvatar' participantId={props.participantId} size={BaseTheme_native_1.default.spacing[5]}/>)}
            </react_native_1.View>
            <react_native_1.View style={styles_1.default.speakerStatsNameTime}>
                <react_native_1.Text style={[styles_1.default.speakerStatsText, props.hasLeft && styles_1.default.speakerStatsLeft]}>
                    {props.displayName}
                </react_native_1.Text>
                <TimeElapsed_1.default style={[
        styles_1.default.speakerStatsText,
        styles_1.default.speakerStatsTime,
        props.isDominantSpeaker && styles_1.default.speakerStatsDominant,
        props.hasLeft && styles_1.default.speakerStatsLeft
    ]} time={props.dominantSpeakerTime}/>
            </react_native_1.View>
        </react_native_1.View>);
exports.default = SpeakerStatsItem;
