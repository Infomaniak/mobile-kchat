"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getURLWithoutParamsNormalized = exports.getURLWithoutParams = void 0;
/**
 * Gets a {@link URL} without hash and query/search params from a specific
 * {@code URL}.
 *
 * @param {URL} url - The {@code URL} which may have hash and query/search
 * params.
 * @returns {URL}
 */
function getURLWithoutParams(url) {
    const { hash, search } = url;
    if ((hash && hash.length > 1) || (search && search.length > 1)) {
        url = new URL(url.href); // eslint-disable-line no-param-reassign
        url.hash = '';
        url.search = '';
        // XXX The implementation of URL at least on React Native appends ? and
        // # at the end of the href which is not desired.
        let { href } = url;
        if (href) {
            href.endsWith('#') && (href = href.substring(0, href.length - 1));
            href.endsWith('?') && (href = href.substring(0, href.length - 1));
            // eslint-disable-next-line no-param-reassign
            url.href === href || (url = new URL(href));
        }
    }
    return url;
}
exports.getURLWithoutParams = getURLWithoutParams;
/**
 * Gets a URL string without hash and query/search params from a specific
 * {@code URL}.
 *
 * @param {URL} url - The {@code URL} which may have hash and query/search
 * params.
 * @returns {string}
 */
function getURLWithoutParamsNormalized(url) {
    const urlWithoutParams = getURLWithoutParams(url).href;
    if (urlWithoutParams) {
        return urlWithoutParams.toLowerCase();
    }
    return '';
}
exports.getURLWithoutParamsNormalized = getURLWithoutParamsNormalized;
