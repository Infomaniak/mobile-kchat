interface IDimensions {
    height: number;
    width: number;
}
interface IFilmstripDimensions {
    columns?: number;
    filmstripHeight?: number;
    filmstripWidth?: number;
    gridDimensions?: {
        columns: number;
        rows: number;
    };
    hasScroll?: boolean;
    thumbnailSize?: IDimensions;
}
export interface IFilmstripState {
    activeParticipants: Array<{
        participantId: string;
        pinned?: boolean;
    }>;
    enabled: boolean;
    horizontalViewDimensions: {
        hasScroll?: boolean;
        local?: IDimensions;
        remote?: IDimensions;
        remoteVideosContainer?: IDimensions;
    };
    isResizing: boolean;
    participantsVolume: {
        [participantId: string]: number;
    };
    remoteParticipants: string[];
    screenshareFilmstripDimensions: {
        filmstripHeight?: number;
        filmstripWidth?: number;
        thumbnailSize?: IDimensions;
    };
    screenshareFilmstripParticipantId?: string | null;
    stageFilmstripDimensions: IFilmstripDimensions;
    tileViewDimensions?: IFilmstripDimensions;
    topPanelHeight: {
        current: number | null;
        userSet: number | null;
    };
    topPanelVisible: boolean;
    verticalViewDimensions: {
        gridView?: {
            gridDimensions: {
                columns: number;
                rows: number;
            };
            hasScroll: boolean;
            thumbnailSize: IDimensions;
        };
        hasScroll?: boolean;
        local?: IDimensions;
        remote?: IDimensions;
        remoteVideosContainer?: IDimensions;
    };
    visible: boolean;
    visibleParticipantsEndIndex: number;
    visibleParticipantsStartIndex: number;
    visibleRemoteParticipants: Set<string>;
    width: {
        current: number | null;
        userSet: number | null;
    };
}
export {};
