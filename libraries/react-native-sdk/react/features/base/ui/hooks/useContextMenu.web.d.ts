type RaiseContext<T> = {
    /**
     * The entity for which the menu is context menu is raised.
     */
    entity?: T;
    /**
     * Target elements against which positioning calculations are made.
     */
    offsetTarget?: HTMLElement | null;
};
declare const useContextMenu: <T>() => [(force?: boolean | Object) => void, (entity: T, target: HTMLElement | null) => void, (entity: T) => (e?: MouseEvent) => void, () => void, () => void, RaiseContext<T>];
export default useContextMenu;
