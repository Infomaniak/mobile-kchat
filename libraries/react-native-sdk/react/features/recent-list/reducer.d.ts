interface IRecent {
    conference: string;
    date: number;
    duration: number;
}
export type IRecentListState = IRecent[];
/**
 * The max size of the list.
 *
 * @type {number}
 */
export declare const MAX_LIST_SIZE = 30;
export {};
