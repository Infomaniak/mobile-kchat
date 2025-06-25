/**
 * Sets the current moderator id or clears it.
 *
 * @param {?string} id - The Follow Me moderator participant id.
 * @returns {{
 *     type: SET_FOLLOW_ME_MODERATOR,
 *     id, string
 * }}
 */
export declare function setFollowMeModerator(id?: string): {
    type: string;
    id: string | undefined;
};
/**
 * Sets the Follow Me feature state.
 *
 * @param {?Object} state - The current state.
 * @returns {{
 *     type: SET_FOLLOW_ME_STATE,
 *     state: Object
 * }}
 */
export declare function setFollowMeState(state?: Object): {
    type: string;
    state: Object | undefined;
};
