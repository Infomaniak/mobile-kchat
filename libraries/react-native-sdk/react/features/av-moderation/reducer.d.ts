export interface IAVModerationState {
    audioModerationEnabled: boolean;
    audioUnmuteApproved?: boolean | undefined;
    audioWhitelist: {
        [id: string]: boolean;
    };
    pendingAudio: Array<{
        id: string;
    }>;
    pendingVideo: Array<{
        id: string;
    }>;
    videoModerationEnabled: boolean;
    videoUnmuteApproved?: boolean | undefined;
    videoWhitelist: {
        [id: string]: boolean;
    };
}
