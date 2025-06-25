import { FaceLandmarks } from '../../face-landmarks/types';
import { ISpeakerStats } from '../../speaker-stats/reducer';
export interface IConferenceMetadata {
    recording?: {
        isTranscribingEnabled: boolean;
    };
    whiteboard?: {
        collabDetails: {
            roomId: string;
            roomKey: string;
        };
    };
}
export interface IJitsiConference {
    addCommandListener: Function;
    addLobbyMessageListener: Function;
    addTrack: Function;
    authenticateAndUpgradeRole: Function;
    avModerationApprove: Function;
    avModerationReject: Function;
    callUUID?: string;
    createVideoSIPGWSession: Function;
    dial: Function;
    disableAVModeration: Function;
    disableLobby: Function;
    enableAVModeration: Function;
    enableLobby: Function;
    end: Function;
    getBreakoutRooms: Function;
    getConnection: Function;
    getLocalParticipantProperty: Function;
    getLocalTracks: Function;
    getMeetingUniqueId: Function;
    getMetadataHandler: Function;
    getName: Function;
    getParticipantById: Function;
    getParticipantCount: Function;
    getParticipants: Function;
    getRole: Function;
    getSpeakerStats: () => ISpeakerStats;
    getSsrcByTrack: Function;
    grantOwner: Function;
    isAVModerationSupported: Function;
    isE2EEEnabled: Function;
    isE2EESupported: Function;
    isEndConferenceSupported: Function;
    isLobbySupported: Function;
    isP2PActive: Function;
    isSIPCallingSupported: Function;
    isStartAudioMuted: Function;
    isStartVideoMuted: Function;
    join: Function;
    joinLobby: Function;
    kickParticipant: Function;
    leave: Function;
    lobbyApproveAccess: Function;
    lobbyDenyAccess: Function;
    lock: Function;
    markParticipantVerified: Function;
    muteParticipant: Function;
    myLobbyUserId: Function;
    myUserId: Function;
    off: Function;
    on: Function;
    options: any;
    removeTrack: Function;
    replaceTrack: Function;
    room: IJitsiConferenceRoom;
    sendApplicationLog: Function;
    sendCommand: Function;
    sendCommandOnce: Function;
    sendEndpointMessage: Function;
    sendFaceLandmarks: (faceLandmarks: FaceLandmarks) => void;
    sendFeedback: Function;
    sendLobbyMessage: Function;
    sendMessage: Function;
    sendPrivateTextMessage: Function;
    sendTextMessage: Function;
    sendTones: Function;
    sessionId: string;
    setAssumedBandwidthBps: (value: number) => void;
    setDesktopSharingFrameRate: Function;
    setDisplayName: Function;
    setLocalParticipantProperty: Function;
    setMediaEncryptionKey: Function;
    setReceiverConstraints: Function;
    setSenderVideoConstraint: Function;
    setStartMutedPolicy: Function;
    setSubject: Function;
    startRecording: Function;
    startVerification: Function;
    stopRecording: Function;
    toggleE2EE: Function;
}
export interface IConferenceState {
    assumedBandwidthBps?: number;
    authEnabled?: boolean;
    authLogin?: string;
    authRequired?: IJitsiConference;
    conference?: IJitsiConference;
    conferenceTimestamp?: number;
    dataChannelOpen?: boolean;
    e2eeSupported?: boolean;
    error?: Error;
    followMeEnabled?: boolean;
    joining?: IJitsiConference;
    leaving?: IJitsiConference;
    lobbyWaitingForHost?: boolean;
    localSubject?: string;
    locked?: string;
    membersOnly?: IJitsiConference;
    metadata?: IConferenceMetadata;
    obfuscatedRoom?: string;
    obfuscatedRoomSource?: string;
    p2p?: Object;
    password?: string;
    passwordRequired?: IJitsiConference;
    pendingSubjectChange?: string;
    room?: string;
    startAudioMutedPolicy?: boolean;
    startReactionsMuted?: boolean;
    startVideoMutedPolicy?: boolean;
    subject?: string;
}
export interface IJitsiConferenceRoom {
    locked: boolean;
    myroomjid: string;
    roomjid: string;
    xmpp: {
        moderator: {
            logout: Function;
        };
    };
}
