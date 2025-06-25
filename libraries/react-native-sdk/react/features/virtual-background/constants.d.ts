/**
 * An enumeration of the different virtual background types.
 *
 * @enum {string}
 */
export declare const VIRTUAL_BACKGROUND_TYPE: {
    IMAGE: string;
    BLUR: string;
    NONE: string;
};
export type Image = {
    id: string;
    src: string;
    tooltip?: string;
};
export declare const BACKGROUNDS_LIMIT = 25;
export declare const IMAGES: Array<Image>;
