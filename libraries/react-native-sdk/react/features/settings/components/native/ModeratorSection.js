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
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/conference/actions");
const actions_2 = require("../../../base/settings/actions");
const Switch_1 = __importDefault(require("../../../base/ui/components/native/Switch"));
const functions_native_1 = require("../../functions.native");
const FormRow_1 = __importDefault(require("./FormRow"));
const FormSection_1 = __importDefault(require("./FormSection"));
const ModeratorSection = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { followMeEnabled, startAudioMuted, startVideoMuted, startReactionsMuted } = (0, react_redux_1.useSelector)((state) => (0, functions_native_1.getModeratorTabProps)(state));
    const { disableReactionsModeration } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const onStartAudioMutedToggled = (0, react_1.useCallback)((enabled) => {
        dispatch((0, actions_1.setStartMutedPolicy)(Boolean(enabled), Boolean(startVideoMuted)));
    }, [startVideoMuted, dispatch, actions_1.setStartMutedPolicy]);
    const onStartVideoMutedToggled = (0, react_1.useCallback)((enabled) => {
        dispatch((0, actions_1.setStartMutedPolicy)(Boolean(startAudioMuted), Boolean(enabled)));
    }, [startAudioMuted, dispatch, actions_1.setStartMutedPolicy]);
    const onFollowMeToggled = (0, react_1.useCallback)((enabled) => {
        dispatch((0, actions_1.setFollowMe)(Boolean(enabled)));
    }, [dispatch, actions_1.setFollowMe]);
    const onStartReactionsMutedToggled = (0, react_1.useCallback)((enabled) => {
        dispatch((0, actions_1.setStartReactionsMuted)(Boolean(enabled), true));
        dispatch((0, actions_2.updateSettings)({ soundsReactions: enabled }));
    }, [dispatch, actions_2.updateSettings, actions_1.setStartReactionsMuted]);
    const moderationSettings = (0, react_1.useMemo)(() => {
        const moderation = [
            {
                label: 'settings.startAudioMuted',
                state: startAudioMuted,
                onChange: onStartAudioMutedToggled
            },
            {
                label: 'settings.startVideoMuted',
                state: startVideoMuted,
                onChange: onStartVideoMutedToggled
            },
            {
                label: 'settings.followMe',
                state: followMeEnabled,
                onChange: onFollowMeToggled
            },
            {
                label: 'settings.startReactionsMuted',
                state: startReactionsMuted,
                onChange: onStartReactionsMutedToggled
            }
        ];
        if (disableReactionsModeration) {
            moderation.pop();
        }
        return moderation;
    }, [startAudioMuted,
        startVideoMuted,
        followMeEnabled,
        disableReactionsModeration,
        startReactionsMuted]);
    return (<FormSection_1.default label='settings.playSounds'>
            {moderationSettings.map(({ label, state, onChange }) => (<FormRow_1.default key={label} label={label}>
                        <Switch_1.default checked={Boolean(state)} onChange={onChange}/>
                    </FormRow_1.default>))}
        </FormSection_1.default>);
};
exports.default = ModeratorSection;
