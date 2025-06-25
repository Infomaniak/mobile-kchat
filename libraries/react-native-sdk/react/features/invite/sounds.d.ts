/**
 * Maps the sounds IDs with the filenames sounds associated with them.
 *
 * @type {Map<string, string>}
 */
export declare const sounds: Map<string, {
    file: string;
    options?: undefined;
} | {
    file: string;
    options: {
        loop: boolean;
    };
}>;
