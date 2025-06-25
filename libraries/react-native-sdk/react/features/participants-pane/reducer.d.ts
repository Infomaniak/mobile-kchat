export interface IParticipantsPaneState {
    isOpen: boolean;
    participantsVolume: {
        [participantId: string]: number;
    };
}
