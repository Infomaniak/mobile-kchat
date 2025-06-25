import { FaceLandmarks } from '../face-landmarks/types';
export interface ISpeaker {
    addFaceLandmarks: (faceLandmarks: FaceLandmarks) => void;
    displayName?: string;
    getDisplayName: () => string;
    getFaceLandmarks: () => FaceLandmarks[];
    getTotalDominantSpeakerTime: () => number;
    getUserId: () => string;
    hasLeft: () => boolean;
    hidden?: boolean;
    isDominantSpeaker: () => boolean;
    isLocalStats: () => boolean;
    isModerator?: boolean;
    markAsHasLeft: () => boolean;
    setDisplayName: (newName: string) => void;
    setDominantSpeaker: (isNowDominantSpeaker: boolean, silence: boolean) => void;
    setFaceLandmarks: (faceLandmarks: FaceLandmarks[]) => void;
}
export interface ISpeakerStats {
    [key: string]: ISpeaker;
}
export interface ISpeakerStatsState {
    criteria: string | null;
    isOpen: boolean;
    offsetLeft: number;
    offsetRight: number;
    pendingReorder: boolean;
    showFaceExpressions: boolean;
    sortedSpeakerStatsIds: Array<string>;
    stats: ISpeakerStats;
    timelineBoundary: number | null;
    timelinePanning: {
        active: boolean;
        x: number;
    };
}
