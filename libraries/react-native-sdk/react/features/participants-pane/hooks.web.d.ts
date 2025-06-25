interface IDrawerParticipant {
    displayName?: string;
    participantID: string;
}
/**
 * Hook used to create admit/reject lobby actions.
 *
 * @param {Object} participant - The participant for which the actions are created.
 * @param {Function} closeDrawer - Callback for closing the drawer.
 * @returns {Array<Function>}
 */
export declare function useLobbyActions(participant?: IDrawerParticipant | null, closeDrawer?: Function): ((e: any) => void)[];
/**
 * Hook used to create actions & state for opening a drawer.
 *
 * @returns {Array<any>}
 */
export declare function useParticipantDrawer(): [
    IDrawerParticipant | null,
    () => void,
    (p: IDrawerParticipant | null) => void
];
export {};
