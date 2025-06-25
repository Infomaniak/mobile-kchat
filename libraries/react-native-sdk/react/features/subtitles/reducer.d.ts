interface ITranscriptMessage {
    final: string;
    participantName: string;
    stable: string;
    unstable: string;
}
export interface ISubtitlesState {
    _displaySubtitles: boolean;
    _language: string | null;
    _requestingSubtitles: boolean;
    _transcriptMessages: Map<string, ITranscriptMessage> | any;
}
export {};
