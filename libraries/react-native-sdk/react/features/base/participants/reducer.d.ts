import { ILocalParticipant, IParticipant } from './types';
export interface IParticipantsState {
    dominantSpeaker?: string;
    fakeParticipants: Map<string, IParticipant>;
    local?: ILocalParticipant;
    localScreenShare?: IParticipant;
    numberOfNonModeratorParticipants: number;
    numberOfParticipantsDisabledE2EE: number;
    numberOfParticipantsNotSupportingE2EE: number;
    overwrittenNameList: {
        [id: string]: string;
    };
    pinnedParticipant?: string;
    raisedHandsQueue: Array<{
        id: string;
        raisedHandTimestamp: number;
    }>;
    remote: Map<string, IParticipant>;
    remoteVideoSources: Set<string>;
    sortedRemoteParticipants: Map<string, string>;
    sortedRemoteVirtualScreenshareParticipants: Map<string, string>;
    speakersList: Map<string, string>;
}
