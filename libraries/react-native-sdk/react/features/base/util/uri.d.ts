/**
 * Http status codes.
 */
export declare enum StatusCode {
    PaymentRequired = 402
}
/**
 * The app linking scheme.
 * TODO: This should be read from the manifest files later.
 */
export declare const APP_LINK_SCHEME = "org.jitsi.meet:";
/**
 * The {@link RegExp} pattern of the protocol of a URI.
 *
 * FIXME: The URL class exposed by JavaScript will not include the colon in
 * the protocol field. Also in other places (at the time of this writing:
 * the DeepLinkingMobilePage.js) the APP_LINK_SCHEME does not include
 * the double dots, so things are inconsistent.
 *
 * @type {string}
 */
export declare const URI_PROTOCOL_PATTERN = "^([a-z][a-z0-9\\.\\+-]*:)";
/**
 * Converts a path to a backend-safe format, by splitting the path '/' processing each part.
 * Properly lowercased and url encoded.
 *
 * @param {string?} path - The path to convert.
 * @returns {string?}
 */
export declare function getBackendSafePath(path?: string): string | undefined;
/**
 * Converts a room name to a backend-safe format. Properly lowercased and url encoded.
 *
 * @param {string?} room - The room name to convert.
 * @returns {string?}
 */
export declare function getBackendSafeRoomName(room?: string): string | undefined;
/**
 * Gets the (Web application) context root defined by a specific location (URI).
 *
 * @param {Object} location - The location (URI) which defines the (Web
 * application) context root.
 * @public
 * @returns {string} - The (Web application) context root defined by the
 * specified {@code location} (URI).
 */
export declare function getLocationContextRoot({ pathname }: {
    pathname: string;
}): string;
/**
 * Parses a specific URI string into an object with the well-known properties of
 * the {@link Location} and/or {@link URL} interfaces implemented by Web
 * browsers. The parsing attempts to be in accord with IETF's RFC 3986.
 *
 * @param {string} str - The URI string to parse.
 * @public
 * @returns {{
 *     hash: string,
 *     host: (string|undefined),
 *     hostname: (string|undefined),
 *     pathname: string,
 *     port: (string|undefined),
 *     protocol: (string|undefined),
 *     search: string
 * }}
 */
export declare function parseStandardURIString(str: string): {
    [key: string]: any;
};
/**
 * Parses a specific URI which (supposedly) references a Jitsi Meet resource
 * (location).
 *
 * @param {(string|undefined)} uri - The URI to parse which (supposedly)
 * references a Jitsi Meet resource (location).
 * @public
 * @returns {{
 *     contextRoot: string,
 *     hash: string,
 *     host: string,
 *     hostname: string,
 *     pathname: string,
 *     port: string,
 *     protocol: string,
 *     room: (string|undefined),
 *     search: string
 * }}
 */
export declare function parseURIString(uri?: string): any;
/**
 * Sometimes we receive strings that we don't know if already percent-encoded, or not, due to the
 * various sources we get URLs or room names. This function encapsulates the decoding in a safe way.
 *
 * @param {string} text - The text to decode.
 * @returns {string}
 */
export declare function safeDecodeURIComponent(text: string): string;
/**
 * Attempts to return a {@code String} representation of a specific
 * {@code Object} which is supposed to represent a URL. Obviously, if a
 * {@code String} is specified, it is returned. If a {@code URL} is specified,
 * its {@code URL#href} is returned. Additionally, an {@code Object} similar to
 * the one accepted by the constructor of Web's ExternalAPI is supported on both
 * mobile/React Native and Web/React.
 *
 * @param {Object|string} obj - The URL to return a {@code String}
 * representation of.
 * @returns {string} - A {@code String} representation of the specified
 * {@code obj} which is supposed to represent a URL.
 */
export declare function toURLString(obj?: (Object | string)): string | undefined;
/**
 * Attempts to return a {@code String} representation of a specific
 * {@code Object} similar to the one accepted by the constructor
 * of Web's ExternalAPI.
 *
 * @param {Object} o - The URL to return a {@code String} representation of.
 * @returns {string} - A {@code String} representation of the specified
 * {@code Object}.
 */
export declare function urlObjectToString(o: {
    [key: string]: any;
}): string | undefined;
/**
 * Adds hash params to URL.
 *
 * @param {URL} url - The URL.
 * @param {Object} hashParamsToAdd - A map with the parameters to be set.
 * @returns {URL} - The new URL.
 */
export declare function addHashParamsToURL(url: URL, hashParamsToAdd?: Object): URL;
/**
 * Returns the decoded URI.
 *
 * @param {string} uri - The URI to decode.
 * @returns {string}
 */
export declare function getDecodedURI(uri: string): string;
/**
 * Adds new param to a url string. Checks whether to use '?' or '&' as a separator (checks for already existing params).
 *
 * @param {string} url - The url to modify.
 * @param {string} name - The param name to add.
 * @param {string} value - The value for the param.
 *
 * @returns {string} - The modified url.
 */
export declare function appendURLParam(url: string, name: string, value: string): string;
/**
 * Adds new hash param to a url string.
 * Checks whether to use '?' or '&' as a separator (checks for already existing params).
 *
 * @param {string} url - The url to modify.
 * @param {string} name - The param name to add.
 * @param {string} value - The value for the param.
 *
 * @returns {string} - The modified url.
 */
export declare function appendURLHashParam(url: string, name: string, value: string): string;
/**
 * Sanitizes the given URL so that it's safe to use. If it's unsafe, null is returned.
 *
 * @param {string|URL} url - The URL that needs to be sanitized.
 *
 * @returns {URL?} - The sanitized URL, or null otherwise.
 */
export declare function sanitizeUrl(url?: string | URL): URL | null;
