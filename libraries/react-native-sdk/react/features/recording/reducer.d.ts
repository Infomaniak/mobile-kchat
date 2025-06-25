export interface ISessionData {
    error?: Error;
    id?: string;
    initiator?: {
        getId: Function;
    };
    liveStreamViewURL?: string;
    mode?: string;
    status?: string;
    terminator?: {
        getId: Function;
    };
    timestamp?: number;
}
export interface IRecordingState {
    disableHighlightMeetingMoment: boolean;
    pendingNotificationUids: {
        [key: string]: string | undefined;
    };
    selectedRecordingService: string;
    sessionDatas: Array<ISessionData>;
    streamKey?: string;
    wasStartRecordingSuggested?: boolean;
}
