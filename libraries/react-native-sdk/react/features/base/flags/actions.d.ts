/**
 * Updates the current features flags with the given ones. They will be merged.
 *
 * @param {Object} flags - The new flags object.
 * @returns {{
 *     type: UPDATE_FLAGS,
 *     flags: Object
 * }}
 */
export declare function updateFlags(flags: Object): {
    type: string;
    flags: Object;
};
