/**
 * Gets the trigger element's and the context menu's bounds/size info and
 * computes the style to apply to the context menu to positioning it correctly
 * in regards to the given position info.
 *
 * @param {DOMRect} triggerBounds -The bounds info of the trigger html element.
 * @param {DOMRectReadOnly} dialogSize - The size info of the context menu.
 * @param {string} position - The position of the context menu in regards to the trigger element.
 *
 * @returns {Object} = The style to apply to context menu for positioning it correctly.
 */
export declare const getContextMenuStyle: (triggerBounds: DOMRect, dialogSize: DOMRectReadOnly, position: string) => {
    position: string;
    bottom: string;
} | {
    position: string;
    top: string;
} | {
    position: string;
    right: string;
} | {
    position: string;
    left: string;
} | {
    bottom: string;
    position: string;
    right: string;
};
