export interface IResponsiveUIState {
    aspectRatio: Symbol;
    clientHeight: number;
    clientWidth: number;
    contextMenuOpened: boolean;
    isNarrowLayout: boolean;
    reducedUI: boolean;
    safeAreaInsets?: {
        bottom: number;
        left: number;
        right: number;
        top: number;
    };
}
