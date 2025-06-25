export interface ITranscribingState {
    isTranscribing: boolean;
    potentialTranscriberJIDs: string[];
    transcriberJID?: string | null;
}
