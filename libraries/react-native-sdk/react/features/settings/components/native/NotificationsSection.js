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
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/settings/actions");
const Switch_1 = __importDefault(require("../../../base/ui/components/native/Switch"));
const functions_any_1 = require("../../functions.any");
const FormRow_1 = __importDefault(require("./FormRow"));
const FormSection_1 = __importDefault(require("./FormSection"));
const styles_1 = __importDefault(require("./styles"));
const NotificationsSection = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { soundsIncomingMessage, soundsParticipantJoined, soundsParticipantKnocking, soundsParticipantLeft, soundsReactions, soundsTalkWhileMuted, enableReactions, enabledNotifications, disabledSounds, moderatorMutedSoundsReactions } = (0, react_redux_1.useSelector)((state) => (0, functions_any_1.getNotificationsTabProps)(state));
    const sounds = (0, react_1.useMemo)(() => {
        const partialSounds = [
            {
                label: 'settings.reactions',
                state: soundsReactions,
                name: 'soundsReactions',
                disabled: Boolean(moderatorMutedSoundsReactions
                    || disabledSounds.includes('REACTION_SOUND'))
            },
            {
                label: 'settings.incomingMessage',
                state: soundsIncomingMessage,
                name: 'soundsIncomingMessage'
            },
            {
                label: 'settings.participantJoined',
                state: soundsParticipantJoined,
                name: 'soundsParticipantJoined'
            },
            {
                label: 'settings.participantLeft',
                state: soundsParticipantLeft,
                name: 'soundsParticipantLeft'
            },
            {
                label: 'settings.talkWhileMuted',
                state: soundsTalkWhileMuted,
                name: 'soundsTalkWhileMuted'
            },
            {
                label: 'settings.participantKnocking',
                state: soundsParticipantKnocking,
                name: 'soundsParticipantKnocking'
            }
        ];
        if (!enableReactions) {
            partialSounds.shift();
        }
        return partialSounds;
    }, [soundsReactions,
        soundsIncomingMessage,
        soundsParticipantJoined,
        soundsParticipantLeft,
        soundsTalkWhileMuted,
        soundsParticipantKnocking,
        enableReactions]);
    const onSoundToggled = (0, react_1.useCallback)((name) => (enabled) => {
        dispatch((0, actions_1.updateSettings)({ [name]: enabled }));
    }, [dispatch, actions_1.updateSettings]);
    const onNotificationToggled = (0, react_1.useCallback)((name) => (enabled) => {
        dispatch((0, actions_1.updateSettings)({
            userSelectedNotifications: {
                ...enabledNotifications,
                [name]: Boolean(enabled)
            }
        }));
    }, [dispatch, actions_1.updateSettings, enabledNotifications]);
    return (<>
            <FormSection_1.default label='settings.playSounds'>
                {sounds.map(({ label, state, name, disabled }) => (<FormRow_1.default key={label} label={label}>
                            <Switch_1.default checked={Boolean(state)} disabled={disabled} onChange={onSoundToggled(name)}/>
                        </FormRow_1.default>))}
            </FormSection_1.default>
            {Object.keys(enabledNotifications).length > 0 && (<>
                        {/* @ts-ignore */}
                        <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                        <FormSection_1.default label='notify.displayNotifications'>
                            {Object.keys(enabledNotifications).map(name => (<FormRow_1.default key={name} label={name}>
                                        <Switch_1.default checked={Boolean(enabledNotifications[name])} onChange={onNotificationToggled(name)}/>
                                    </FormRow_1.default>))}
                        </FormSection_1.default>
                    </>)}
        </>);
};
exports.default = NotificationsSection;
