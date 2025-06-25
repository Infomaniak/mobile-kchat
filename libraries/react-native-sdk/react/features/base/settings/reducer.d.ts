export interface ISettingsState {
    audioOutputDeviceId?: string;
    audioSettingsVisible?: boolean;
    avatarURL?: string;
    cameraDeviceId?: string | boolean;
    disableCallIntegration?: boolean;
    disableCrashReporting?: boolean;
    disableP2P?: boolean;
    disableSelfView?: boolean;
    displayName?: string;
    email?: string;
    hideShareAudioHelper?: boolean;
    localFlipX?: boolean;
    maxStageParticipants?: number;
    micDeviceId?: string | boolean;
    serverURL?: string;
    soundsIncomingMessage?: boolean;
    soundsParticipantJoined?: boolean;
    soundsParticipantKnocking?: boolean;
    soundsParticipantLeft?: boolean;
    soundsReactions?: boolean;
    soundsTalkWhileMuted?: boolean;
    startAudioOnly?: boolean;
    startCarMode?: boolean;
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    userSelectedAudioOutputDeviceId?: string;
    userSelectedAudioOutputDeviceLabel?: string;
    userSelectedCameraDeviceId?: string;
    userSelectedCameraDeviceLabel?: string;
    userSelectedMicDeviceId?: string;
    userSelectedMicDeviceLabel?: string;
    userSelectedNotifications?: {
        [key: string]: boolean;
    };
    userSelectedSkipPrejoin?: boolean;
    videoSettingsVisible?: boolean;
    visible?: boolean;
}
