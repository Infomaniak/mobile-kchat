// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Does nothing
 */
export const noop = () => {}; // eslint-disable-line no-empty-function

/**
 * Call a function with no args
 */
export const call = (fn: () => unknown) => {
    fn();
};

/**
 * Voids a function (return type)
 */
export const voided = <T extends unknown[]>(fn: (...args: T) => unknown): (...args: T) => void =>
    (...args: T) => {
        fn(...args);
    };

/**
 * Debounce a function call:
 *  - duration: the debounce time in milliseconds
 *  - options.leading: should the function be immediatly fired when starting a debounce
 *  - options.trailing: should the function be fire after the debounce ended (default behavior)
 *  - options.callback: optional callback fired after the debounce
 *
 * Calling debouncedFn.cancel() allow canceling any pending debounced function execution
 */
export const debounce = <T extends (...args: any[]) => any>(
    fn: T,
    duration: number = 0,
    {leading = false, trailing = true, callback}:
    { leading?: boolean; trailing?: boolean; callback?: (...args: Parameters<T>) => any } = {},
): (((...args: Parameters<T>) => (ReturnType<T> | void)) & {
    cancel: () => void;
}) => {
    type Args = Parameters<T>;

    // Neither leading nor trailing call
    if (!leading && !trailing) {
        return Object.assign(noop, {cancel: noop});
    }

    // Call count clears itself after each debounced call
    let callCount = 0;
    let firstCallArgs: Args | undefined;
    let lastCallArgs: Args | undefined;
    let timeout: NodeJS.Timeout | undefined;

    // Compute the trailing functions
    const trailingFns = [] as Array<() => void>;
    if (trailing) {
        trailingFns.push(() => {
            if (!leading || callCount > 1 || firstCallArgs !== lastCallArgs) {
                fn(...lastCallArgs!);
            }
        });
    }
    if (typeof callback === 'function') {
        trailingFns.push(() => {
            callback(...lastCallArgs!);
        });
    }

    // Create the trailing fn
    const trailingFn = trailingFns.length > 0 ? () => {
        trailingFns.map(call);
    } : noop;

    return Object.assign(
        (...args: Args) => {
            lastCallArgs = args;

            if (typeof timeout === 'number') {
                callCount++;
                clearTimeout(timeout);
            } else {
                callCount = 1;
                firstCallArgs = args;

                // Fire the leading call
                if (leading) {
                    fn(...args);
                }
            }

            // Fire the timeout
            timeout = setTimeout(trailingFn, Math.max(0, duration));
        },
        {

            /**
             * Cancel any pending timeout on the debounced function
             */
            cancel: () => {
                if (typeof timeout === 'number') {
                    clearTimeout(timeout);
                }
            },
        },
    );
};
