interface IValue {
    startedTime: number;
    value: number;
}
export interface IAnalyticsState {
    initialPermanentProperties: Object;
    isInitialized: boolean;
    localTracksDuration: {
        audio: IValue;
        conference: IValue;
        video: {
            camera: IValue;
            desktop: IValue;
        };
    };
}
export {};
