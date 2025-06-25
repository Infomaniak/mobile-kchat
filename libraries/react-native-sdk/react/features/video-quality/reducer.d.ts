export interface IVideoQualityState {
    maxReceiverVideoQualityForLargeVideo: number;
    maxReceiverVideoQualityForScreenSharingFilmstrip: number;
    maxReceiverVideoQualityForStageFilmstrip: number;
    maxReceiverVideoQualityForTileView: number;
    maxReceiverVideoQualityForVerticalFilmstrip: number;
    minHeightForQualityLvl: Map<number, number>;
    preferredVideoQuality: number;
}
export interface IVideoQualityPersistedState {
    persistedPrefferedVideoQuality?: number;
}
